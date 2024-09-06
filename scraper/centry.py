from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from neo4j import GraphDatabase
from dotenv import load_dotenv
import os

players = ["k293", "o098", "b484", "e155", "m873", "s675", "k260", "h284", "c524", "o099", "b545", "s381", "n210", "s772", "p387", "a092", "b585", "m614", "b350", "d291", "f316", "s550", "k237", "s402", "l311", "l290", "s809", "h380", "p485", "f292", "r255", "l386", "s604", "c433", "s741"]
# check =
# player = players[0]
year = 2001
entries = []

driver = webdriver.Chrome()

for player in players:
    try:
        driver.get(f"https://www.atptour.com/en/players/x/{player}/player-activity?matchType=Singles&year={year}&tournament=all")
        WebDriverWait(driver, 10).until(EC.presence_of_all_elements_located((By.CLASS_NAME, 'tournament-footer')))

        result = {
            'pid': player,
            'tournaments': []
        }

        wrapper = driver.find_element(By.XPATH, '/html/body/div[6]/div/div[3]/div/div[1]/div[3]/div[3]')
        h3s = wrapper.find_elements(By.TAG_NAME, 'h3')
        results = wrapper.find_elements(By.CLASS_NAME, 'tournament-footer')

        for index, h3 in enumerate(h3s):
            try:
                link = h3.find_element(By.TAG_NAME, 'a')
                href = link.get_attribute('href')
                tournament_id = href.replace("https://www.atptour.com/en/tournaments/", '').replace('/overview', '').split('/')

                array = results[index].text.split(', ')

                dictionary = {
                    'tournament': int(f"{tournament_id[-1]}{year}"),
                    'points': int(array[0].replace('Points: ', '')),
                    'rank': int(array[1].replace('ATP Ranking: ', '')),
                    'pm': int(array[2].replace('Prize Money: $', '').replace(',', ''))
                }

                result['tournaments'].append(dictionary)
            except:
                continue

        entries.append(result)

    except:
        print(player)

driver.quit()

load_status = load_dotenv("Neo4j-84ef144c-Created-2024-06-18.txt")
if load_status is False:
    raise RuntimeError('Environment variables not loaded.')

URI = os.getenv("NEO4J_URI")
AUTH = (os.getenv("NEO4J_USERNAME"), os.getenv("NEO4J_PASSWORD"))

def writeToDb(db):
    for e in entries:
        for t in e['tournaments']:
            result = db.run("""
                MATCH (p:Player {id: $pid})
                MATCH (e:Event {id: $eid})
                MERGE (p)-[:PLAYED {points: $points, rank: $rank, pm: $pm}]->(e)
                """, pid=e['pid'], eid=t['tournament'], points=t['points'], rank=t['rank'], pm=t['pm'])

with GraphDatabase.driver(URI, auth=AUTH) as ndriver:
    with ndriver.session(database="neo4j") as session:
        records = session.execute_write(writeToDb)