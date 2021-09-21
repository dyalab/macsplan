#!/usr/bin/python3
import urllib.request
import re
import json
from bs4 import BeautifulSoup
#this dictionary defines which majors are scraped. The key is a url fragment specific to each department, and the value is a list of tupes, of which the first value is a url fragment specific to the major and the second is a text description of the major.
majors = {
    'engcompsci':[('cs', 'Computer Science'),
                  ('ams', 'Applied Mathematics and Statistics'),
                  ('ee', 'Electrical Engineering'),
                  ('mechanicalengineering', 'Mechanical Engineering'),
                  ('civilandenvironmentaleng', 'Civil and Environmental Engineering')],
    'appliedscieng':[('physics', 'Physics'),
                     ('chemistryandgeochemistry', 'Chemistry and Geochemistry'),
                     ('chemicalandbiologicalengineering', 'Chemical and Biological Engineering'),
                     ('metallurgicalandmaterialsengineering', 'Metallurgical and Materials Engineering')],
    'earthscieng':[('geophysics', 'Geophysics'),
                   ('geologyandgeologicalengineering', 'Geology and Geological Engineering'),
                   ('liberalartsandinternationalstudies', 'Humanities, Arts, and Social Sciences'),
                   ('economicsandbusiness', 'Economics and Business'),
                   ('petroleumengineering', 'Petroleum Engineering'),
                   ('miningengineering', 'Mining Engineering')],
    'additionalprograms':[('physicaleducationandathletics', 'Physical Education and Athletics'),
                          ('edns', 'Engineering, Design, and Society')]
          }

#start building JSON strings - should probably be replaced with list of dictionaries, converted to JSON at end
#This would make some things easier, e.g. not allowing required courses as electives
majorJson = '['
catalogJson = '['
electiveJson = '['

#various regexes used in parsing
prereq_regex = re.compile(r'(Pre-?requisites?:)([^.]+)(\.)')
coreq_regex = re.compile(r'(Co-?requisites?:)([^.]+)(\.)')
course_regex = re.compile(r'([Cc]oncurrent [Ee]nrollment in )?([A-Z]+[0-9]+)')
level_regex = re.compile(r'[A-Z]+4[0-9]+')
semesters_regex = re.compile(r'\((I)?,? ?(II)?,? ?(S)?\)')

#initialize empty elective lists
free_elect = []
pagn = []
hass = []
csci_elect = []
math_CAM = []
math_STAT = []
ee = []
mech_e = []
civ_breadth = []
struct_design = []
civ_tech = []
chem = []
technical = []

for department in majors:
    for major in majors[department]:
        #get major html
        url = 'https://catalog.mines.edu/undergraduate/programs/{}/{}/'.format(department, major[0])
        response = urllib.request.urlopen(url)
        soup = BeautifulSoup(response, 'html.parser')
        edition = soup.find('div', {'id':'edition-alt'})
        year = edition.find('span').text
        course_table = soup.body.find('table', {'class':'sc_plangrid'})
        #if there are major requirements, iterate through requirements
        if course_table:
            majorJson += '\n{'
            majorJson += '\n"Id": "{}",\n'.format(major[1])
            classes = []
            electives = []
            for row in course_table.findAll('tr'):
                for col in row.findAll('td', {'class':'codecol'}):
                    classid = col.text.strip()
                    if course_regex.match(classid):
                        classes.append(classid)
                    else:
                        #formatting of electives for consistency
                        elective_field = row.find('td', {'class':'titlecol'})
                        elective_description = elective_field.text.strip().upper()
                        elective_description = elective_description.replace('PHYSICAL ACTIVITY COURSE', 'PAGN')
                        elective_description = elective_description.replace('HASS MID-LEVEL ELECTIVE', 'HASS MID-LEVEL RESTRICTED ELECTIVE')
                        elective_description = elective_description.replace('HASS 400-LEVEL ELECTIVE', 'HASS 400-LEVEL RESTRICTED ELECTIVE')
                        elective_description = elective_description.replace('*', '')
                        if 'FREE ELECTIVE' in elective_description:
                            elective_description = 'FREE ELECTIVE'
                        electives.append(elective_description)
            elective_counts = dict()
            #convert from list of electives to list of lists, with each list having a description and a number
            for elective in electives:
                elective_counts[elective] = elective_counts.get(elective,0)+1
            electives = [[key+'xxx', elective_counts[key]] for key in elective_counts]
            majorJson += '"Bulletin": "{}",\n'.format(year)
            majorJson += '"Classes": {},\n'.format(classes).replace("'", '"')
            majorJson += '"Electives": {}\n'.format(electives).replace("'", '"')
            majorJson += '}\n,'

        #iterate through all courses and add them to the catalog
        courses = soup.find('div', {'class':'courses'})
        for courseblock in courses.findAll('div', {'class': 'courseblock'}):
            catalogJson += '\n{\n'
            titleblock = courseblock.findAll('p')[0]
            descblock = courseblock.findAll('p')[1]
            parts = titleblock.text.split('.')
            course_id = parts[0]

            #all classes satisfy free electives
            free_elect.append(course_id)

            #all PAGN classes satisfy PAGN electives
            if 'PAGN' in course_id:
                pagn.append(course_id)

            #CSCI4xx and two other classes satisfy CSCI electives
            if 'CSCI' in course_id and level_regex.search(course_id):
                csci_elect.append(course_id)
            elif course_id in ['MATH307', 'EENG383']:
                csci_elect.append(course_id)

            #Chemistry electives are all non-required chem classes
            if 'CHGN' in course_id:
                #TODO - remove required classes
                chem.append(course_id)

            name = parts[1].strip()
            hours = parts[2].strip()+'.'+parts[3].split(' ')[0]
            catalogJson += '"Id": "{}",\n'.format(course_id)
            catalogJson += '"Name": "{}",\n'.format(name)
            #format hours if it is not just an int
            if '-' in hours:
                parts = hours.split('-')
                min_hours = parts[0]+'.0'
                max_hours = parts[1][0]+'.0'
            else:
                min_hours = hours
                max_hours = hours

            catalogJson += '"Max_Credits": "{}",\n'.format(max_hours)
            catalogJson += '"Min_Credits": "{}",\n'.format(min_hours)
            prereqs = []
            m = prereq_regex.search(descblock.text)
            if m:
                #horrible messy logic to determine if prereqs are OR or AND, as well as if they are co-reqs
                #I would guess it is about 98% reliable
                prereq_text = m.group(2)
                for andblock in prereq_text.split('and'):
                    if ' or ' in andblock or '/' in andblock:
                        if andblock.count(' or ') > 1:
                            #the block consists of multiple blocks:
                            for commablock in andblock.split(','):
                                if ' or ' in commablock:
                                    options = []
                                    for course in course_regex.finditer(commablock):
                                        text = ""
                                        if course.group(1):
                                            text = "!"
                                        text += course.group(2)
                                        options.append(text)
                                    if len(options)>=1:
                                        prereqs.append(options)
                                else:
                                    for course in course_regex.finditer(commablock):
                                        text = ""
                                        if course.group(1):
                                            text = "!"
                                        text += course.group(2)
                                        prereqs.append(text)
                        else:
                            #the block has multiple options
                            options = []
                            for course in course_regex.finditer(andblock):
                                text = ""
                                if course.group(1):
                                    text = "!"
                                text += course.group(2)
                                options.append(text)
                            if len(options)>=1:
                                prereqs.append(options)
                    else:
                        #everything in the block is necessary
                        for course in course_regex.finditer(andblock):
                            text = ""
                            if course.group(1):
                                text = "!"
                            text += course.group(2)
                            prereqs.append([text])
                m = coreq_regex.search(descblock.text)
                if m:
                    coreq_text = m.group(2)
                    for andblock in coreq_text.split('and'):
                        if ' or ' in andblock or '/' in andblock:
                            #the block has multiple options
                            options = []
                            for course in course_regex.finditer(andblock):
                                options.append('!'+course.group(2))
                            if len(options)>=1:
                                prereqs.append(options)
                        else:
                            #everything in the block is necessary
                            for course in course_regex.finditer(andblock):
                                prereqs.append(['!'+course.group(2)])

            catalogJson += '"Pre_req": {},\n'.format(prereqs).replace("'", '"')

            #parse out what semesters the class is offered
            m = semesters_regex.search(descblock.text)
            semesters = []
            if m:
                if m.group(1):
                    semesters.append('Fall')
                if m.group(2):
                    semesters.append('Spring')
                if m.group(3):
                    semesters.append('Summer')
            catalogJson += '"Semesters": {}\n'.format(semesters).replace("'", '"')
            catalogJson += '}\n,'

        #These majors have 1 or more types of electives with an accompanying list - this parses those lists.
        #The formatting is slightly different for some of them, so I couldn't find a cleaner way than just having if statements for each major
        #TODO - add more majors
        majortext = soup.body.find('div', {'id':'majortextcontainer'})
        if major[1] == 'Humanities, Arts, and Social Sciences':
            requirements_table = majortext.find('table', {'class':'sc_courselist'})
            for row in requirements_table.findAll('tr'):
                hass.append(row.find('td', {'class':'codecol'}).text)
            hass400 = [course for course in hass if level_regex.search(course)]
        elif major[1] =='Applied Mathematics and Statistics':
            tables = majortext.findAll('table', {'class':'sc_courselist'})
            for row in tables[0].findAll('tr'):
                code = row.find('td', {'class':'codecol'})
                if code:
                    math_CAM.append(code.text)
            for row in tables[1].findAll('tr'):
                code = row.find('td', {'class': 'codecol'})
                if code:
                    math_STAT.append(code.text)
        elif major[1] =='Electrical Engineering':
            tables = majortext.findAll('table', {'class': 'sc_courselist'})
            for row in tables[0].findAll('tr'):
                code = row.find('td', {'class': 'codecol'})
                if code:
                    ee.append(code.text)
        elif major[1] == 'Mechanical Engineering':
            for table in majortext.findAll('table', {'class': 'sc_courselist'}):
                for row in table.findAll('tr'):
                    code = row.find('td', {'class': 'codecol'})
                    if code:
                        mech_e.append(code.text)
        elif major[1] == 'Civil and Environmental Engineering':
            tables = majortext.findAll('table', {'class': 'sc_courselist'})
            for row in tables[0].findAll('tr'):
                code = row.find('td', {'class': 'codecol'})
                if code:
                    civ_breadth.append(code.text)
            for row in tables[1].findAll('tr'):
                code = row.find('td', {'class': 'codecol'})
                if code:
                    struct_design.append(code.text)
            for row in tables[2].findAll('tr'):
                code = row.find('td', {'class': 'codecol'})
                if code:
                    civ_tech.append(code.text)
        elif major[1] == 'Chemistry and Geochemistry':
            table = majortext.find('table', {'class': 'sc_courselist'})
            for row in table.findAll('tr'):
                code = row.find('td', {'class': 'codecol'})
                if code:
                    technical.append(code.text)

#convert lists of electives into JSON
electiveJson += '\n{{\n"Id": "PAGNxxx",\n"Classes": {}\n}}\n,\n'.format(pagn).replace("'", '"')
electiveJson += '{{\n"Id": "HASS MID-LEVEL RESTRICTED ELECTIVExxx",\n"Classes": {}\n}}\n,\n'.format(hass).replace("'", '"')
electiveJson += '{{\n"Id": "HASS 400-LEVEL RESTRICTED ELECTIVExxx",\n"Classes": {}\n}}\n,\n'.format(hass400).replace("'", '"')
electiveJson += '{{\n"Id": "COMPUTER SCIENCE ELECTIVExxx",\n"Classes": {}\n}}\n,\n'.format(csci_elect).replace("'", '"')
electiveJson += '{{\n"Id": "FREE ELECTIVExxx",\n"Classes": {}\n}}\n,\n'.format(free_elect).replace("'", '"')
electiveJson += '{\n"Id": "COMPUTER ELECTIVE1xxx",\n"Classes": ["CSCI262"]\n}\n,\n'
electiveJson += '{{\n"Id": "MATHEMATICS-CAM ELECTIVE2xxx",\n"Classes": {}\n}}\n,\n'.format(math_CAM).replace("'", '"')
electiveJson += '{{\n"Id": "MATHEMATICS-CAM/STAT ELECTIVE2xxx",\n"Classes": {}\n}}\n,\n'.format(math_CAM+math_STAT).replace("'", '"')
electiveJson += '{{\n"Id": "ELECTRICAL ENGINEERING ELECTIVExxx",\n"Classes": {}\n}}\n,\n'.format(ee).replace("'", '"')
electiveJson += '{{\n"Id": "MECHANICAL ENGINEERING ELECTIVExxx",\n"Classes": {}\n}}\n,\n'.format(mech_e).replace("'", '"')
electiveJson += '{{\n"Id": "CIVIL ENGINEERING BREADTH ELECTIVExxx",\n"Classes": {}\n}}\n,\n'.format(civ_breadth).replace("'", '"')
electiveJson += '{{\n"Id": "STRUCTURAL DESIGN ELECTIVExxx",\n"Classes": {}\n}}\n,\n'.format(struct_design).replace("'", '"')
electiveJson += '{{\n"Id": "CIVIL ENGINEERING TECHNICAL ELECTIVExxx",\n"Classes": {}\n}}\n,\n'.format(civ_tech).replace("'", '"')
electiveJson += '{{\n"Id": "CHEMISTRY ELECTIVExxx",\n"Classes": {}\n}}\n,\n'.format(chem).replace("'", '"')
electiveJson += '{{\n"Id": "TECHNICAL ELECTIVExxx",\n"Classes": {}\n}}\n'.format(technical).replace("'", '"')


#Final JSON formatting - should probably be replaced with a JSON object at somepoint
electiveJson += ']'
majorJson= majorJson[:-1]
majorJson += ']'
catalogJson = catalogJson[:-1]
catalogJson +=']'

#write JSON files
with open('catalog.json', 'w+', encoding='utf8') as catalog:
    catalog.write(catalogJson)
with open('majors.json', 'w+', encoding='utf8') as majors:
    majors.write(majorJson)
with open('electives.json', 'w+', encoding='utf8') as elect:
    elect.write(electiveJson)
