import unittest
import os
from pathlib import Path
from sample_scripts.simple import main
from sample_scripts.driver import run_t2wml

repo_folder=Path(__file__).parents[2]
unit_test_folder=os.path.join(repo_folder, "t2wml-api", "unit_tests", "ground_truth")


class TestScripts(unittest.TestCase):
    maxDiff = None
    def setUp(self):
        self.property_file=os.path.join(unit_test_folder, "property_type_map.json")
        test_folder=os.path.join(unit_test_folder, "error-catching")
        self.test_folder=test_folder
        self.data_filepath=os.path.join(test_folder, "input_1.csv")
        self.sheet_name="input_1.csv"
        self.yaml_filepath=os.path.join(test_folder, "error.yaml")
        self.wikifier_filepath=os.path.join(test_folder, "wikifier_1.csv")


    def test_simple_script(self):
        output_filename=os.path.join(self.test_folder, "simply_script_results.tsv")
        main(self.property_file, self.data_filepath, self.sheet_name, self.yaml_filepath, self.wikifier_filepath, output_filename)

    def test_driver(self):
        output_directory=os.path.join(self.test_folder, "driver_output")
        run_t2wml(self.data_filepath, self.wikifier_filepath, self.yaml_filepath, 
                output_directory, filetype="json")






if __name__ == '__main__':
    unittest.main()