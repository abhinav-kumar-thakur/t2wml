import os
import json
from tests.utils import (client, create_project, load_data_file, load_yaml_file, 
                        load_wikifier_file, get_project_files)


def xtest_switching_back_to_sheets(client):
    #the bug is described in issue 156
    files_dir=os.path.join(os.path.dirname(__file__), "files_for_tests", "homicide")


    path=create_project(client)
    load_data_file(client, path, os.path.join(files_dir, "homicide_report_total_and_sex.xlsx"))


    #load yaml
    response=load_yaml_file(client, path, filename=os.path.join(files_dir, "t2wml", "table-1a.yaml"))
    data = response.data.decode("utf-8")
    yaml_1_data = json.loads(data)["layers"][0]
    

    #switch tab
    url='/api/data/{sheet_name}?project_folder={path}'.format(path=path,sheet_name="table-1b")
    response=client.get(url) 

    #load new yaml
    response=load_yaml_file(client, path, filename=os.path.join(files_dir, "t2wml", "table-1b.yaml"))
    data = response.data.decode("utf-8")
    yaml_2_data = json.loads(data)["layers"][0]

    #switch back to previous tab
    url='/api/data/{sheet_name}?project_folder={path}'.format(path=path,sheet_name="table-1a")
    response=client.get(url) 
    data = response.data.decode("utf-8")
    switch_back_data = json.loads(data)["layers"][0]
    
    assert yaml_1_data!=yaml_2_data
    assert yaml_1_data==switch_back_data

def xtest_empty_cells(client):
    #the bug is described in issue 153
    files_dir=os.path.join(os.path.dirname(__file__), "files_for_tests", "empty_cells")

    #change project settings
    url='/api/project/settings?project_folder={path}'.format(path=files_dir)
    response=client.put(url,
            data=dict(
            warnEmpty=False
        )) 

    #get project results
    data= get_project_files(client, files_dir)

    #change project settings
    url='/api/project/settings?project_folder={path}'.format(path=files_dir)
    response=client.put(url,
            data=dict(
            warnEmpty=True
        )) 
    
    #reapply yaml:
    response=load_yaml_file(client, files_dir, filename=os.path.join(files_dir, "t2wml.yaml"))
    data2 = response.data.decode("utf-8")
    data2 = json.loads(data2)

    #once again, this is cheating
    error_cells_1=data["layers"][4]["entries"][4]["indices"]
    error_cells_2=data2["layers"][4]["entries"][4]["indices"]
    assert error_cells_1!=error_cells_2