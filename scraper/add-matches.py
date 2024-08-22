from neo4j import GraphDatabase
import json
from dotenv import load_dotenv
import os

data = open('test.json')
matches = json.load(data)

load_status = load_dotenv("Neo4j-84ef144c-Created-2024-06-18.txt")
if load_status is False:
    raise RuntimeError('Environment variables not loaded.')

URI = os.getenv("NEO4J_URI")
AUTH = (os.getenv("NEO4J_USERNAME"), os.getenv("NEO4J_PASSWORD"))

def writeToDb(db):
    for match in matches:
        s1_properties = {
            's1': match['p1'].get('s1'),
            's2': match['p1'].get('s2'),
            's3': match['p1'].get('s3'),
            's4': match['p1'].get('s4'),
            's5': match['p1'].get('s5')
        }
        s1_query = ', '.join([f"{k}: ${k}" for k, v in s1_properties.items() if v is not None])

        # Collect the dynamic parts for s2
        s2_properties = {
            's1': match['p2'].get('s1'),
            's2': match['p2'].get('s2'),
            's3': match['p2'].get('s3'),
            's4': match['p2'].get('s4'),
            's5': match['p2'].get('s5')
        }
        s2_query = ', '.join([f"{k}: ${k}" for k, v in s2_properties.items() if v is not None])

        # Final Cypher query
        query = f"""
            MATCH (e:Event {{id: 3471968}})
            MATCH (p1:Player {{id: $p1}})
            MATCH (p2:Player {{id: $p2}})
            MERGE (m:Match:Best5 {{id: $id, round: $round, match_no: $match_no, sort_date: date($date)}})
            MERGE (m)-[:PLAYED]->(e)
            MERGE (s1:Score:P1 {{id: $score1, {s1_query}}})
            MERGE (s2:Score:P2 {{id: $score2, {s2_query}}})
            MERGE (p1)-[:SCORED]->(s1)
            MERGE (s1)-[:SCORED]->(m)
            MERGE (p2)-[:SCORED]->(s2)
            MERGE (s2)-[:SCORED]->(m)
        """

        # Parameters for the query
        params = {
            'p1': match['p1']['id'],
            'p2': match['p2']['id'],
            'id': match['id'],
            'round': match['round'],
            'match_no': match['match_no'],
            'date': '1968-04-22',
            'score1': f"{match['id']} {match['p1']['id']}",
            'score2': f"{match['id']} {match['p2']['id']}",
        }

        # Add the dynamic parameters, ensuring no conflicts
        params.update({k: v for k, v in s1_properties.items() if v is not None})
        params.update({k: v for k, v in s2_properties.items() if v is not None})

        # Run the query with the appropriate parameters
        db.run(query, **params)

with GraphDatabase.driver(URI, auth=AUTH) as driver:
    with driver.session(database="neo4j") as session:
        records = session.execute_write(writeToDb)

data.close()