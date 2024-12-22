from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from neo4j import GraphDatabase
from dotenv import load_dotenv
import os
import time
import re

# For stat matches

tid = 316
draw = 'Best3'
sort_date = '2019-07-15'
year = 2019

# driver = webdriver.Chrome()
# driver.get(f"https://www.atptour.com/en/scores/archive/x/{tid}/{year}/draws")
# WebDriverWait(driver, 10).until(EC.presence_of_all_elements_located((By.CLASS_NAME, 'draw')))

# buttons = driver.find_elements(By.CLASS_NAME, 'button')
# matches = []
# matches_links = []

load_status = load_dotenv("Neo4j-27ea30cf-Created-2024-09-23.txt")
if load_status is False:
    raise RuntimeError('Environment variables not loaded.')

URI = os.getenv("NEO4J_URI")
AUTH = (os.getenv("NEO4J_USERNAME"), os.getenv("NEO4J_PASSWORD"))

# for index, button in enumerate(buttons):
#     if button.text != 'Previous' and button.text != '':
#         button.click()
#         time.sleep(1)

#         round = driver.find_element(By.CLASS_NAME, f"draw-round-{index}")
#         round_header = round.find_element(By.CLASS_NAME, 'draw-header')

#         matches_list = round.find_elements(By.CLASS_NAME, 'draw-item')
#         match_no = 0
#         if round_header.text == 'Final':
#             match_number = 0
#         elif round_header.text == 'Semifinals':
#             match_number = 1
#         elif round_header.text == 'Quarterfinals':
#             match_number = 3
#         elif round_header.text == 'Round of 16':
#             match_number = 8
#         elif round_header.text == 'Round of 32':
#             match_number = 16
#         elif round_header.text == 'Round of 64':
#             match_number = 32
#         else:
#             match_number = 64

#         for match in matches_list:
#             match_no += 1
#             match_number += 1

#             # Players info
#             players = match.find_elements(By.CLASS_NAME, 'name')
#             ps = []

#             match_info = {
#                 'id': f"{tid}{year} {button.text} {match_no}",
#                 'match_no': match_number,
#                 'round': round_header.text
#             }

#             for player in players:
#                 try:
#                     player_link = player.find_element(By.TAG_NAME, 'a').get_attribute('href')
#                     id = re.search("/([a-zA-Z0-9]{4})/", player_link)
#                     ps.append(id.group(1))
#                 except:
#                     ps.append(None)

#             if ps[0]:
#                 match_info['p1'] = {}
#                 match_info['p1'] = ps[0]
#             if ps[1]:
#                 match_info['p2'] = {}
#                 match_info['p2'] = ps[1]

#             try:
#                 stat = match.find_element(By.CLASS_NAME, 'stats-cta')
#                 stats_link = stat.find_elements(By.TAG_NAME, 'a')
#                 matches_links.append(stats_link[1].get_attribute('href'))
#             except:
#                 pass

#             matches.append(match_info)

# driver.quit()
# print(matches_links)

matches = [{'id': '3162019 QF 1', 'match_no': 65, 'round': 'Quarterfinals', 'p1': 'ca12', 'p2': 'j551'}, {'id': '3162019 QF 2', 'match_no': 66, 'round': 'Quarterfinals', 'p1': 'd874', 'p2': 'sh90'}, {'id': '3162019 QF 3', 'match_no': 67, 'round': 'Quarterfinals', 'p1': 'lb84', 'p2': 'g628'}, {'id': '3162019 QF 4', 'match_no': 68, 'round': 'Quarterfinals', 'p1': 'cf59', 'p2': 'r772'}, {'id': '3162019 SF 1', 'match_no': 65, 'round': 'Semifinals', 'p1': 'j551', 'p2': 'd874'}, {'id': '3162019 SF 2', 'match_no': 66, 'round': 'Semifinals', 'p1': 'lb84', 'p2': 'r772'}, {'id': '3162019 F 1', 'match_no': 65, 'round': 'Final', 'p1': 'j551', 'p2': 'lb84'}]

def writeToDb(db):
    for match in matches:
        params = {
            'id': int(f"{tid}{year}"),
            'mid': match['id'],
            'round': match['round'],
            'match_no': match['match_no'],
            'date': sort_date
        }

        if match.get('p1') is not None and match.get('p2') is not None:

            # query = f"""
            #     MATCH (e:Event {{id: $id}})
            #     MERGE (p1:Player {{id: $p1}})
            #     ON CREATE
            #     SET p1:Update
            #     MERGE (p2:Player {{id: $p2}})
            #     ON CREATE
            #     SET p2:Update
            #     MERGE (m:Match:Update:{draw} {{id: $mid, round: $round, match_no: $match_no, sort_date: date($date)}})
            #     MERGE (m)-[:PLAYED]->(e)
            #     MERGE (s1:Score:P1 {{id: $score1}})
            #     MERGE (s2:Score:P2 {{id: $score2}})
            #     MERGE (p1)-[:SCORED]->(s1)
            #     MERGE (s1)-[:SCORED]->(m)
            #     MERGE (p2)-[:SCORED]->(s2)
            #     MERGE (s2)-[:SCORED]->(m)
            # """

            query = f"""
                MATCH (:Event {{id: $id}})-[]-(r:Round {{round: $round}})
                MATCH (p1:Entry {{id: toString($id) + ' ' + $p1}})
                MATCH (p2:Entry {{id: toString($id) + ' ' + $p2}})
                MERGE (m:Match:{draw} {{id: $mid, match_no: $match_no, sort_date: date($date)}})
                MERGE (m)-[:PLAYED]->(r)
                MERGE (s1:Score:P1 {{id: $score1}})
                MERGE (s2:Score:P2 {{id: $score2}})
                MERGE (p1)-[:SCORED]->(s1)
                MERGE (s1)-[:SCORED]->(m)
                MERGE (p2)-[:SCORED]->(s2)
                MERGE (s2)-[:SCORED]->(m)
            """

            params['p1'] = match['p1']
            params['p2'] = match['p2']
            params['score1'] = f"{match['id']} {match['p1']}"
            params['score2'] = f"{match['id']} {match['p2']}"

        elif match.get('p1') is not None:
            # query = f"""
            #     MATCH (e:Event {{id: $id}})
            #     MERGE (p1:Player {{id: $p1}})
            #     ON CREATE
            #     SET p1:Update
            #     MERGE (m:Match {{id: $mid, round: $round, match_no: $match_no, sort_date: date($date), incomplete: 'B'}})
            #     MERGE (m)-[:PLAYED]->(e)
            #     MERGE (s1:Score:P1:Winner {{id: $score1}})
            #     MERGE (p1)-[:SCORED]->(s1)
            #     MERGE (s1)-[:SCORED]->(m)
            #     SET m.incomplete = 'B'
            # """

            query = f"""
                MATCH (e:Event {{id: $id}})-[]-(r:Round {{round: $round}})
                MATCH (p1:Entry {{id: toString($id) + ' ' + $p1}})
                MERGE (m:Match {{id: $mid, match_no: $match_no, sort_date: date($date), incomplete: 'B'}})
                MERGE (m)-[:PLAYED]->(r)
                MERGE (s1:Score:P1:Winner {{id: $score1}})
                MERGE (p1)-[:SCORED]->(s1)
                MERGE (s1)-[:SCORED]->(m)
                SET m.incomplete = 'B'
            """

            params['p1'] = match['p1']
            params['score1'] = f"{match['id']} {match['p1']}"

        elif match.get('p2') is not None:
            # query = f"""
            #     MATCH (e:Event {{id: $id}})
            #     MERGE (p2:Player {{id: $p2}})
            #     ON CREATE
            #     SET p2:Update
            #     MERGE (m:Match {{id: $mid, round: $round, match_no: $match_no, sort_date: date($date)}})
            #     MERGE (m)-[:PLAYED]->(e)
            #     MERGE (s2:Score:P2:Winner {{id: $score2}})
            #     MERGE (p2)-[:SCORED]->(s2)
            #     MERGE (s2)-[:SCORED]->(m)
            #     SET m.incomplete = 'B'
            # """

            query = f"""
                MATCH (e:Event {{id: $id}})-[]-(r:Round {{round: $round}})
                MATCH (p2:Entry {{id: toString($id) + ' ' + $p2}})
                MERGE (m:Match {{id: $mid, match_no: $match_no, sort_date: date($date)}})
                MERGE (m)-[:PLAYED]->(r)
                MERGE (s2:Score:P2:Winner {{id: $score2}})
                MERGE (p2)-[:SCORED]->(s2)
                MERGE (s2)-[:SCORED]->(m)
                SET m.incomplete = 'B'
            """

            params['p2'] = match['p2']
            params['score2'] = f"{match['id']} {match['p2']}"

        else:
            # query = f"""
            #     MATCH (e:Event {{id: $id}})
            #     MERGE (m:Match {{id: $mid, round: $round, match_no: $match_no, sort_date: date($date)}})
            #     MERGE (m)-[:PLAYED]->(e)
            # """
            query = f"""
                MATCH (e:Event {{id: $id}})-[]-(r:Round {{round: $round}})
                MERGE (m:Match {{id: $mid, match_no: $match_no, sort_date: date($date)}})
                MERGE (m)-[:PLAYED]->(r)
            """

        db.run(query, **params)

with GraphDatabase.driver(URI, auth=AUTH) as driver:
    with driver.session(database="neo4j") as session:
        records = session.execute_write(writeToDb)