#Scraper
#Python 2.7

#!/usr/bin/env python

import selenium
from selenium import webdriver
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
import os
import urllib2
import re
from bs4 import BeautifulSoup
import urllib
import pandas as pd
import sqlalchemy as sa
from sys import platform
import json
from nltk.tokenize import sent_tokenize

print platform
if platform == "darwin":
    driver = webdriver.PhantomJS('/Users/samharden/phantomjs-2.1.1-macosx/bin/phantomjs')
elif platform == "linux2":
    driver = webdriver.PhantomJS('/node_modules/phantomjs/lib/phantom/bin/phantomjs')


for n in range(10, 20):
    try:
        # driver.get('http://fchr.state.fl.us/fchr/complaints__1/final_orders/final_orders_2001/fchr_order_no_01_00'+str(n))
        driver.get('http://fchr.state.fl.us/fchr/layout/set/print/content/view/full/16'+str(n))
        page = driver.page_source


        soup = BeautifulSoup(page, 'html.parser')
        case_text = soup.prettify()

        # print case_text

        prelim = soup.find(string=re.compile("Preliminary Matters"))
        prelim_text = prelim.find_next('td').get_text()
        # print prelim_text
        print "________________________________"
        print n

        petitioner = soup.find(string=re.compile("COMMISSION ON HUMAN RELATIONS"))
        petitioner_name = petitioner.find_next('font').get_text()
        print petitioner_name
        name_is = petitioner_name.split('V.')[0]
        name_is_now = name_is.replace(",","").replace("Petitioner","").strip()
        print "Petitioner = ",name_is_now


        respondent = petitioner_name.split('V.')[1]
        res_is_now = respondent.replace(",","").replace("Respondent","").strip()
        print "Respondent = ",res_is_now

        judge_search = soup(string=re.compile("Administrative Law Judge"))[-1]
        judge_field = judge_search.find_previous('br').get_text()
        judge_name = judge_field.split("Administrative Law Judge")[0].replace(",","").strip().strip('\\').replace('\\u2019',"'")
        print "Judge = ", judge_name

        fchr_no_search = soup.find(string=re.compile("FCHR Order No.")).split("/")[0].replace("FCHR Order No.","").strip().strip('\\').replace('\\u2019',"'")
        print fchr_no_search

        doah_no_search = soup.find(string=re.compile("DOAH Case No.")).find_previous('br').get_text().split("FCHR Order No.")[0].replace("DOAH Case No.","").strip().strip('\\').replace('\\u2019',"'")
        print doah_no_search

        title_search = soup.find(string=re.compile("FCHR Case No.")).find_next('strong').get_text().strip().replace('\\u2019',"'")
        print "Title = ", title_search

        case_desc = soup.find(string=re.compile("Preliminary Matters")).find_next('td').get_text().strip().replace('\n',"").strip('\\').replace('\\u2019',"'")
        # print "Case Desc = ", case_desc
        sent_tokenize_list = sent_tokenize(case_desc)
        case_desc_text = sent_tokenize_list[0]
        print "Case Description = ", case_desc_text

        if "UNLAWFUL EMPLOYMENT PRACTICE" in case_text:
            case_type = "Unlawful Employment Practice"
        elif "DISCRIMINATORY HOUSING PRACTICE" in case_text:
            case_type = "Discriminatory Housing Practice"
        print "Case Type = ", case_type

        if "FINAL ORDER DISMISSING" in case_text:
            result_desc = "Dismissed with Prejudice"
            heading_x = "Dismissal"
        elif "ORDER REMANDING" in case_text:
            result_desc = "Remanded for Further Proceedings"
            heading_x = "Remand"
        elif "REMANDING MATTER FOR DETERMINATION OF RELIEF" in case_text:
            result_desc = "Discrimination Found, Remanded for Determination of Relief"
            heading_x = "Remand and Relief"

        if "Finding of Fact and Conclusions of Law" in case_desc:
            pass
        else:
            conclusions_law = soup.find(string=re.compile("Conclusions of Law")).find_next('br').get_text().strip().split('Exceptions')[0].replace('\n',"").strip('\\').replace('\\u2019',"'")
            print "Conclusions of law = ", conclusions_law

        if "Finding of Fact" in case_desc:
            preliminary_matters = case_desc.split('Finding of Fact')[0].replace('\n',"").replace('"',"'").strip('\\').replace('\\u2019',"'")
            print "Prelim Matters = ", preliminary_matters
            # find_fact = case_desc.split('Conclusions of Law')[1]
            # print "Findings of Fact = ", find_fact
        else:
            preliminary_matters = case_desc.split('Conclusions of Law')[0].replace('\n',"").replace('"',"'").strip('\\').replace('\\u2019',"'")
            print "Prelim Matters = ", preliminary_matters

        conclusions_law = soup.find(string=re.compile("Conclusions of Law")).find_next('br').get_text().strip().split('Exceptions')[0].replace('\n',"").replace('"',"'").strip('\\').replace('\\u2019',"'")
        print "Conclusions of law = ", conclusions_law

        if result_desc == "Dismissed with Prejudice":
            exceptions_text = soup.find(string=re.compile("Exceptions")).find_next('br').get_text().strip().split('Dismissal')[0].replace('\n',"").replace('"',"'").strip('\\').replace('\\u2019',"'")
            print "Exceptions = ", exceptions_text
        elif result_desc == "Remanded for Further Proceedings":
            exceptions_text = soup.find(string=re.compile("Exceptions")).find_next('br').get_text().strip().split('Remand')[0].replace('\n',"").replace('"',"'").strip('\\').replace('\\u2019',"'")
            print "Exceptions = ", exceptions_text

        # if "Conclusions of Law" in case_desc:
        #     preliminary_matters = case_desc.split('Finding of Fact')[0]
        #     print "Prelim Matters = ", preliminary_matters
        #     # find_fact = case_desc.split('Conclusions of Law')[1]
        #     # print "Findings of Fact = ", find_fact
        # else:
        #     preliminary_matters = case_desc.split('Conclusions of Law')[0]
        #     print "Prelim Matters = ", preliminary_matters

        info_json = (
            {

                "case_num": {
                    "fchr": fchr_no_search,
                    "doah": doah_no_search
                },
                "judge": {
                    "name": judge_name
                },
                "casetype": {
                    "type": case_type
                },

                "description": case_desc_text,
                "name": {
                    "petitioner": name_is_now,
                    "respondent": res_is_now
                  },
                "attorneys": {
                    "atty_petitioner": "Jerrylene Barr, Pro Se",
                    "atty_respondent": "Kip P. Roth, Esq."
                  },

                "result": {
                    "description": result_desc

                },
                "title": {
                    "description": title_search

                },
                "opinion": {
                    "heading_1": "Preliminary Matters",
                    "heading_1_text": [preliminary_matters],
                    "heading_2": "Finding of Fact",
                    "heading_2_text": "hellp",
                    "heading_3": "Conclusions of Law",
                    "heading_3_text":[conclusions_law],
                    "heading_4": "Exceptions",
                    "heading_4_text":[exceptions_text],
                    "heading_5": heading_x,
                    "heading_5_text":"Hm"
                }
            }
        )
        # print info_json
        os.chdir('/Users/samharden/fchr-final-orders/test')


        with open('file'+str(n)+'.json', 'wb') as f:
            json.dump(info_json, f, sort_keys=True)


    except Exception as e:
        print str(e)
