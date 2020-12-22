from pathlib import Path
from t2wml.api import Sheet, SpreadsheetFile, Wikifier
try:
    from t2wml.api import ProjectWithSavedState as Project
except:
    from t2wml.api import Project
from caching import CacheHolder


class CalcParams:
    def __init__(self, project_path, data_path, sheet_name, yaml_path=None):
        self.project_path = project_path
        self.data_path = data_path
        self.sheet_name = sheet_name
        self.yaml_path = yaml_path

    @property
    def project(self):
        return Project.load(self.project_path)

    @property
    def sheet(self):
        return Sheet(self.data_path, self.sheet_name)

    @property
    def cache(self):
        if self.yaml_path:
            return CacheHolder(self.project, self.data_path, self.sheet_name, self.yaml_path)

    @property
    def wikifier(self):
        project=self.project
        if project.current_wikifiers:
            wikifier_files = [Path(self.project_path) / wf for wf in project.current_wikifiers]
        else:
            wikifier_files=[]
        wikifier = Wikifier()
        for path in wikifier_files:
            wikifier.add_file(path)
        return wikifier

    @property
    def sheet_names(self):
        # sticking this here for convenience, even though the only place it is used is table_data
        sf = SpreadsheetFile(self.data_path)
        return list(sf.sheet_names)

    @property
    def sparql_endpoint(self):
        p = Project.load(self.project_path)
        return p.sparql_endpoint

