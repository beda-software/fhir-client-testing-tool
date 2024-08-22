compose = docker compose
tests_profile = --profile tests
tests_env = --env-file ./envs/.env.test
dev_profile = --profile development
dev_env = --env-file ./envs/.env.development

.PHONY: run pull build up stop down

run: build up
run_tests: tests_build tests_run tests_down

pull:
	$(compose) $(dev_env) $(dev_profile) pull

build:
	$(compose) $(dev_env) $(dev_profile) build

up:
	$(compose) $(dev_env) $(dev_profile) up

stop:
	$(compose) $(dev_env) $(dev_profile) stop

down:
	$(compose) $(dev_env) $(dev_profile) down -v

tests_build:
	$(compose) $(tests_env) $(tests_profile) build

tests_run:
	$(compose) $(tests_env) $(tests_profile) up --abort-on-container-exit

tests_down:
	$(compose) $(tests_env) $(tests_profile) down -v
