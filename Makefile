# Marks these commands as tasks, not actual files in your directory
.PHONY: start lint test push install build clean format

start:
	npm run dev

lint:
	npm run lint

test:
	npm test

# Git workflow. Usage: make push m="your commit message"
push:
	git add .
	git commit -m "$(m)"
	git push -u origin main

install:
	npm install

# Builds the app for production
build:
	npm run build

# Runs prettier to auto-format across the entire codebase
format:
	npm run format

# Deletes node_modules and reinstalls from scratch
clean:
	rm -rf node_modules package-lock.json
	npm install