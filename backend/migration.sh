npm --prefix ./presence-service run generate
npm --prefix ./chat-service run generate
npm --prefix ./user-service run generate

npm --prefix ./presence-service run migrate
npm --prefix ./chat-service run migrate
npm --prefix ./user-service run migrate