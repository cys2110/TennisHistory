from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import json
import time

driver = webdriver.Chrome()
json_objects = []

for i in range(1968, 2025):
    tournament_list = []
    months = ['month-03', 'month-04', 'month-05', 'month-06', 'month-07', 'month-08', 'month-09', 'month-10', 'month-11', 'month-12']

    driver.get(f"https://www.wtatennis.com/tournaments/{i}")
    WebDriverWait(driver, 10).until(EC.presence_of_all_elements_located((By.ID, 'main-content')))

    for month in months:
        element = driver.find_element(By.ID, month)
        driver.execute_script("arguments[0].scrollIntoView(true)", element)
        time.sleep(1)

    tournaments = driver.find_elements(By.CLASS_NAME, 'tournament-thumbnail__link')

    for tournament in tournaments:
        href = tournament.get_attribute('href')
        tournament_list.append(href)

    dictionary = {
        'year': i,
        'tournaments': tournament_list
    }
    json_objects.append(dictionary)

driver.quit()

json_object = json.dumps(json_objects, indent=4)

with open('test.json', 'w') as jsonfile:
    jsonfile.write(json_object)