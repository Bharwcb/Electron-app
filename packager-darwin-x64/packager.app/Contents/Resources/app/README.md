# Shriners Hospitals for Children

## Classy - BB CRM Import

### How To Use

1. Have NPM up and running on your computer

2. Open command line

3. 'cd' into the shriners_import' directory

4. run 'node main.js' on command line

5. You will be asked to enter start and end dates

* CORRECT FORMAT: 2017-01-26T10:00:00 (January 26, 2017 at 10AM UTC)

* OFFSET: If using an offset, format according to our API documentation (https://developers.classy.org/api-docs/v2/index.html)

* EXAMPLE: 2017-01-26T10:00:00+0500 (January 26, 2017 at 10AM Eastern)

* You may select 'now' for your end_date to get the current DateTime

6. After end date is entered, report will run.

7. Once report is complete, open project's 'Downloads/' directory contents - You will have two files created, a 'Constituent' and 'Revenue' CSV.

8. Right click and open in Excel..



