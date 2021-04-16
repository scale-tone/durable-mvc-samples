:: ----------------------
:: Custom Deployment Script
:: Fetches npm packages inside a temp folder (which is much faster), then zips it and mounts that zip file.
:: ----------------------

@IF "%WEBSITE_RUN_FROM_PACKAGE%" NEQ "1" (
    echo For this script to work you need to enable Run from Package, aka set WEBSITE_RUN_FROM_PACKAGE=1 
    exit /b 1
)

:: Installing yarn, as it installs npm packages much faster
call npm install yarn -g --silent
IF %errorlevel% NEQ 0 goto end

:: Copying sources to a temp folder
SET MY_BUILD_TEMP_FOLDER=%TMP%\771F19D0EE46481380759838873C84E5
mkdir %MY_BUILD_TEMP_FOLDER%
xcopy %DEPLOYMENT_SOURCE%\%RELATIVE_PATH_TO_SOURCES% %MY_BUILD_TEMP_FOLDER% /S /H /Y
IF %errorlevel% NEQ 0 goto end

:: Installing npm packages
cd %MY_BUILD_TEMP_FOLDER%
call yarn
IF %errorlevel% NEQ 0 goto end

:: Zipping the entire temp folder into d:\home\data\SitePackages\package.zip, 
:: which then will be automatically mounted as d:\home\site\wwwroot
mkdir d:\home\data\SitePackages
echo package.zip > d:\home\data\SitePackages\packagename.txt
del /Q d:\home\data\SitePackages\package.zip
powershell "$ProgressPreference = 'SilentlyContinue'; Compress-Archive %MY_BUILD_TEMP_FOLDER%\* d:\home\data\SitePackages\package.zip"

:end
:: Dropping the temp folder, so that no conflicts occur next time
rmdir /S /Q %MY_BUILD_TEMP_FOLDER%
exit /b %ERRORLEVEL%