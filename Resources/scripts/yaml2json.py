#!/usr/bin/python
#
#  Convert yaml in sys.stdin to json.
#
import argparse
import sys
import yaml

def main(**kwargs):

    print kwargs['source']
    print kwargs['output']
    stream = open(kwargs['source'], 'r')
    print yaml.load(stream)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Get a program and run it with input', version='%(prog)s 1.0')
    parser.add_argument('source', type=str, help='Origin path')
    parser.add_argument('output', type=str, help='Output path')
    args = parser.parse_args()
    main(**vars(args))
