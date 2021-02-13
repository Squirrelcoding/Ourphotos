# Ourphotos
Ourphotos is an image sharing website similar to imgBB, where you upload a photo, and share it with other people. You can also add a title and a description for a photo, but that is optional.
![Ourphotos Logo](https://i.ibb.co/q5kh9ht/Ourphotos-logo.png)
# Ourphotos VS Other websites

| Qualities  | Ourphotos |      imgur      |  imgbb |
|--|:----------:|:-------------:|------:|
| Title/Description  | :white_check_mark: |  :white_check_mark: | :x: |
| Downloading feature | :white_check_mark: |   :white_check_mark:   | :white_check_mark: |
| Starts with "O" | :white_check_mark: |:x: | :x: |
| Open Source | :white_check_mark: | :x: | :x:|

# Open Source

Here at Softsquirrel Studios, we believe that code should be open source, so that's what we did! We are now turning our project's into Open source project's by uploading our code to Github. You can even see Debitstore's code [here](https://github.com/Squirrelcoding/DebitStore)

# Notes
- Packager files were removed intentionally
- Downloading Feature is a bit buggy but who cares.
- Report issues at our [bug report/feedback page](https://reviews.softsquirrel.tk/)

Check out the website at https://ourphotos.softsquirrel.tk/

# How to use
Ourphotos uses Firebase to store the files and other data. To try it out, [go to the website](https://ourphotos.softsquirrel.tk/), or do the following steps:

1. Create a Firebase account and get the key
2. Replace `key.json` with your database key.
3. Change the lines `14`, `15`, and `70` with your database URL and bucket name.

# Vulnerabilities
If you have noticed a vulnerability, it would be recommended to report it to `issues`, or our [review/bugs page](https://reviews.softsquirrel.tk)

| Vulnerability  | Status | 
|--|:----------:|
| Firebase key exposed in history | Fixed - Disabled Service Account| 
