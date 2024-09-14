from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from neo4j import GraphDatabase
from dotenv import load_dotenv
import os
import time

players = ["mm58", "d874", "mc10", "mo44", "sl28", "bg23", "ce77", "b0bi", "mq75", "bd06", "su55", "hg86", "n732", "e687", "kc56", "bh09", "hh26", "db63", "rc91", "hb71", "te51", "ae14", "t786", "dh58", "c977", "m0ej", "p09z", "f724", "a0e2", "k926", "v812", "pl56", "bm95", "ke29", "r772", "k0ah", "dh50", "ki95", "ag37", "re44", "me82", "mu94", "da81", "f510", "cd85", "cf59", "gb88", "c0bc", "rh24", "s0ag", "gj37", "c0au", "o449", "mc65", "kf17", "n0ae", "c0c8", "l987", "rh16", "l949", "pd31", "mh30", "bk92", "n0am", "g09o", "sd32", "d0co", "n771", "sm37", "kd46", "g628", "su87", "d875", "ke73", "cg80", "v306", "z355"]
year = 2022
entries = []

driver = webdriver.Chrome()

for player in players:
    try:
        driver.get(f"https://www.atptour.com/en/players/x/{player}/player-activity?matchType=Singles&year={year}&tournament=all")
        WebDriverWait(driver, 10).until(EC.presence_of_all_elements_located((By.CLASS_NAME, 'tournament-footer')))
        time.sleep(3)

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