compose = docker compose

.PHONY: run pull build up stop down

run: build up
run_tests: build tests

pull:
	$(compose) pull

build:
	$(compose) build

up:
	$(compose) up

stop:
	$(compose) stop

down:
	$(compose) down

tests:
	$(compose) run app yarn test
