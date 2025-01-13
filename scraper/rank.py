from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from neo4j import GraphDatabase
from dotenv import load_dotenv
import os
import re

selenium_driver = webdriver.Chrome()
load_status = load_dotenv("Neo4j-27ea30cf-Created-2024-09-23.txt")
if not load_status:
    raise RuntimeError('Environment variables not loaded.')

URI = os.getenv("NEO4J_URI")
AUTH = (os.getenv("NEO4J_USERNAME"), os.getenv("NEO4J_PASSWORD"))
players = []

with GraphDatabase.driver(URI, auth=AUTH) as driver:
    driver.verify_connectivity()

    records, summary, keys = driver.execute_query(
        "MATCH (p:Player)-[]-(f:Entry) WHERE f.id STARTS WITH \"5802025\" RETURN p.id",
        database_="neo4j"
    )

    for player in records:
        player_id = player.data()
        selenium_driver.get(f"https://www.atptour.com/en/players/x/{player_id['p.id']}/player-activity?matchType=Singles&year=2024&tournament=all")
        WebDriverWait(selenium_driver, 10).until(EC.presence_of_all_elements_located((By.CLASS_NAME, 'atp_player_content')))

        try:
            rank = selenium_driver.find_element(By.XPATH, "/html/body/div[3]/div/div/div[1]/div[2]/div[2]/div[1]/div[2]")
            rank_no = re.search(r'\d+', rank.text)

            if rank_no:
                players.append({
                    "id": player_id["p.id"],
                    "rank": int(rank_no.group())
                })
        except:
            print("Rank not found for player", player_id["p.id"])
            continue

    driver.execute_query("""
        UNWIND $players as player
        MATCH (:Player {id: player.id})-[]-(f:Entry) WHERE f.id STARTS WITH "5802025"
        SET f.rank = player.rank
        """, players=players)

selenium_driver.quit()