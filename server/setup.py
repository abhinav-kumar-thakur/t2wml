from setuptools import setup, find_packages
from version import __version__
import os

CLASSIFIERS = [
    'Development Status :: 4 - Beta',
    'Environment :: Web Environment',
    'Framework :: Flask',
    'Intended Audience :: Researchers',
    'License :: OSI Approved :: BSD License',
    'Operating System :: OS Independent',
    'Programming Language :: Python',
    'Topic :: Internet :: WWW/HTTP :: Dynamic Content',
    'Topic :: Software Development :: Libraries :: Application Frameworks',
    "Programming Language :: Python :: 3.7",
]

SCRIPTS = [
    't2wml-server=backend.cli:run_server',
]

REQUIREMENTS = [
    'flask>=1.1.2',
    'flask-cors>=3.0.8',
    'flask-sqlalchemy>=2.4.1',
    'flask-migrate>=2.5.3',
    'SPARQLWrapper>=1.8.4',
    'google-api-python-client>=1.7.11',
    't2wml-api==0.0.1'
    'etk>=2.1.7',
    'en_core_web_sm@https://github.com/explosion/spacy-models/releases/download/en_core_web_sm-2.3.0/en_core_web_sm-2.3.0.tar.gz',
]

PACKAGES = find_packages() + ['.']


setup(
    author="USC ISI",
    name='t2wml-standalone',
    version=__version__,
    description='A standalone version of T2WML',
    long_description=open(os.path.join(os.path.dirname(__file__), 'README.md'), encoding='utf-8').read(),
    license='BSD License',
    platforms=['OS Independent'],
    classifiers=CLASSIFIERS,
    install_requires=REQUIREMENTS,
    tests_require=[
    ],
    packages=PACKAGES,
    include_package_data=True,
    zip_safe=False,
    entry_points={ 'console_scripts': SCRIPTS },
)
