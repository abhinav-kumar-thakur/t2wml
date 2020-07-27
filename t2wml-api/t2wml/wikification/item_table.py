import json
import pandas as pd
from collections import defaultdict
from t2wml.utils.t2wml_exceptions import ItemNotFoundException
from t2wml.utils.bindings import bindings


class ItemTable:
    def __init__(self, lookup_table={}):
        self.lookup_table = defaultdict(dict, lookup_table)

    def lookup_func(self, lookup, column, row, value):
        # order of priority: cell+value> cell> col+value> col> row+value> row> value
        column = int(column)
        row = int(row)
        tuples = [
            (column, row, value),
            (column, row, ''),
            (column, '', value),
            (column, '', ''),
            ('', row, value),
            ('', row, ''),
            ('', '', value)
        ]

        for tup in tuples:
            item = lookup.get(str(tup))
            if item:
                return item

        raise ValueError("Not found")

    def get_item(self, column, row, context='', sheet=None):
        lookup = self.lookup_table.get(context)
        if not lookup:
            raise ItemNotFoundException(
                "No values defined for context: {}".format(context))
        if not sheet:
            sheet = bindings.excel_sheet
        value = sheet[row, column]
        try:
            item = self.lookup_func(lookup, column, row, value)
            return item
        except ValueError:
            return None  # currently this is what the rest of the API expects. could change later
        #   raise ItemNotFoundException("Item for cell "+to_excel(column, row)+"("+value+")"+"with context "+context+" not found")

    def get_item_by_string(self, value, context=''):
        lookup = self.lookup_table.get(context)
        if not lookup:
            raise ItemNotFoundException(
                "No values defined for context: {}".format(context))

        item = lookup.get(str(('', '', value)))
        if item:
            return item
        raise ItemNotFoundException("Could not find item for value: "+value)

    def get_cell_info(self, column, row, sheet):
        # used to serialize table
        bindings.excel_sheet = sheet
        for context in self.lookup_table:
            item = self.get_item(column, row, context)
            if item:
                return item, context, bindings.excel_sheet[row, column]
        return None, None, None

    def update_table_from_dataframe(self, df):
        df = df.fillna('')
        df = df.replace(r'^\s+$', '', regex=True)
        overwritten = {}
        for entry in df.itertuples():
            column = entry.column
            row = entry.row
            value = entry.value
            context = entry.context
            item = entry.item

            if not item:
                raise ValueError("Item definition missing")

            if not column and not row and not value:
                raise ValueError(
                    "at least one of column, row, or value must be defined")

            if column != "":
                column = int(column)
            if row != "":
                row = int(row)
            key = str((column, row, value))
            if self.lookup_table[context].get(key):
                overwritten[key] = self.lookup_table[context][key]
            self.lookup_table[context][key] = item

        if len(overwritten):
            print("Wikifier update overwrote existing values: "+str(overwritten))
        return overwritten


class Wikifier:
    def __init__(self):
        self.wiki_files = []
        self._data_frames = []
        self._item_table = ItemTable()

    def print_data(self):
        print("The wikifier contains {} wiki files, and a total of {} dataframes".format(
            len(self.wiki_files), len(self._data_frames)))
        if len(self.wiki_files):
            print("The files are:")
            for filename in self.wiki_files:
                print(filename)

    @property
    def item_table(self):
        return self._item_table

    def add_file(self, file_path):
        df = pd.read_csv(file_path)
        try:
            overwritten = self.item_table.update_table_from_dataframe(df)
        except Exception as e:
            raise ValueError(
                "Could not apply {} : {}".format(file_path, str(e)))
        self.wiki_files.append(file_path)
        self._data_frames.append(df)
        return overwritten

    def add_dataframe(self, df):
        expected_columns = set(['row', 'column', 'value', 'context', 'item'])
        columns = set(df.columns)
        missing_columns = expected_columns.difference(columns)
        if len(missing_columns):
            raise ValueError(
                "Dataframe for wikifier must contain all 5 expected columns")
        try:
            overwritten = self.item_table.update_table_from_dataframe(df)
        except Exception as e:
            raise ValueError("Could not apply dataframe: "+str(e))
        self._data_frames.append(df)
        return overwritten

    def save(self, filename):
        output = json.dumps({
            "wiki_files": self.wiki_files,
            "lookup_table": self.item_table.lookup_table,
            "dataframes": [df.to_json() for df in self._data_frames]
        })
        with open(filename, 'w') as f:
            f.write(output)

    @classmethod
    def load(cls, filename):
        with open(filename, 'r') as f:
            wiki_args = json.load(f)
        wikifier = Wikifier()
        wikifier.wiki_files = wiki_args["wiki_files"]
        wikifier._item_table = ItemTable(
            lookup_table=wiki_args["lookup_table"])
        wikifier._data_frames = [pd.read_json(
            json_string) for json_string in wiki_args["dataframes"]]
        return wikifier
