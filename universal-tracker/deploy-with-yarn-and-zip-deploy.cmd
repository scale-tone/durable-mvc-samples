call npm install yarn -g --silent

SET MY_BUILD_TEMP_FOLDER=%TMP%\5E2FE8E703E44E62AF18D31EF86E25E0

mkdir %MY_BUILD_TEMP_FOLDER%
xcopy %DEPLOYMENT_SOURCE% %MY_BUILD_TEMP_FOLDER% /S /H /Y
cd %MY_BUILD_TEMP_FOLDER%
call yarn

mkdir d:\home\data\SitePackages
echo package.zip > d:\home\data\SitePackages\packagename.txt
del d:\home\data\SitePackages\package.zip

powershell "$ProgressPreference = 'SilentlyContinue'; Compress-Archive %MY_BUILD_TEMP_FOLDER%\* d:\home\data\SitePackages\package.zip"