#!/usr/bin/env python3
"""
Simple Flask API example with configuration loading
"""
import json
from flask import Flask, jsonify

app = Flask(__name__)

# Load configuration
with open('config.json', 'r') as f:
    config = json.load(f)

@app.route('/')
def home():
    return jsonify({
        'message': 'Welcome to the API',
        'version': config['version'],
        'environment': config['environment']
    })

@app.route('/api/users')
def get_users():
    return jsonify(config['users'])

@app.route('/api/settings')
def get_settings():
    return jsonify(config['settings'])

if __name__ == '__main__':
    app.run(
        host=config['settings']['host'],
        port=config['settings']['port'],
        debug=config['settings']['debug']
    )
