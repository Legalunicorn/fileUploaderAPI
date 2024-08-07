### auth
`POST`     /auth/login ✅

`POST`     /auth/signup ✅


### file
`GET`         /file/:fileID  (get file metadata ) ✅

`GET`         /file/:fileID/content  (download the file) ✅

`POST`        /file ✅

`DELETE`    /file/:fileID //delete from record, and also from cloudinary 

`PATCH`      /file/:fileID ✅


### folder
`GET`   /folder/:folderID ✅

`GET`   /folder/:folderID/files ✅

`POST` /folder ✅

`DELETE`  /folder/:folderID ✅

`PATCH` /folder/:folderID ✅
