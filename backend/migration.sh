
# # Generate database schemas
# npm --prefix ./presence-service run generate
# npm --prefix ./chat-service run generate
# npm --prefix ./user-service run generate

# # Run migrations
# npm --prefix ./presence-service run migrate
# npm --prefix ./chat-service run migrate
# npm --prefix ./user-service run migrate

cd presence-service && npm install && npm run generate && npm run migrate 
cd ../chat-service && npm install && npm run generate && npm run migrate 
cd ../user-service && npm install && npm run generate && npm run migrate 