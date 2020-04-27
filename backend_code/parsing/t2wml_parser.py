from backend_code import t2wml_exceptions as T2WMLExceptions
from backend_code.bindings import bindings
from backend_code.parsing.classes import CellExpression, ItemExpression
from backend_code.parsing.constants import char_dict
from backend_code.parsing.functions import functions_dict

eval_globals=dict()
eval_globals.update(char_dict)
eval_globals.update(functions_dict)


def parse_expression(e_str, context={}):
    #print(context)
    e_str=str(e_str)
    value = CellExpression()
    item=ItemExpression()
    globals = dict(value=value, item=item)
    globals.update(eval_globals)
    globals.update(context)
    e_str= e_str.replace("$", "")
    e_str = e_str.replace("/", ",")
    e_str = e_str.replace("=", "==")
    e_str = e_str.replace("!==", "!=")
    e_str = e_str.replace("->", "and")
    try:
        result = eval(e_str, globals)
        #print(e_str, ":\t", result)
        return result
    except Exception as e:
        print("error in", e_str, ":", str(e))
        raise e

def iter_on_n(expression, context={}):
    #handle iter on variable n. if there is no variable n this will anyway return in first iteration
    upper_limit= max(len(bindings.excel_sheet), len(bindings.excel_sheet[0]))
    for n in range(0, upper_limit):
        try:
            context_dir={"n":n}
            context_dir.update(context)
            return_value= parse_expression(expression, context_dir)
            if return_value:
                return return_value
        except IndexError:
            break