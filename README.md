#ECOMMERCE SERVER 

In this repository i create an ecommerce server using mongodb with express using mongoose 
if you wnt to check this server you have to add all those env . 
# Server Port
PORT=your_desired_port_number

# MongoDB URI
MONGO_URI=your_mongodb_connection_uri

# JWT Secrets
ACCESS_JWT_SECRET=your_access_token_secret
REFRESH_JWT_SECRET=your_refresh_token_secret

# Nodemailer Configuration (for sending emails)
APP_PASSWORD=your_nodemailer_app_password
MY_EMAIL=your_google_email_address

# Cloudinary Configuration (for image management)
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret 


after add all those env in .env file server run using run command npm start .
