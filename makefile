DOCKER_SUBSCRIPTION_IMAGE=$(shell echo $${DOCKER_IMAGE:-adi/subscription})
DOCKER_EMAIL_IMAGE=$(shell echo $${DOCKER_IMAGE:-adi/email})
DOCKER_PUBLIC_IMAGE=$(shell echo $${DOCKER_IMAGE:-adi/public})

default: test
build:
	make build_subscription
	make build_email
	make build_public

build_subscription:
	cd subscription
	docker build -t ${DOCKER_SUBSCRIPTION_IMAGE} ./subscription
 
build_email:
	cd email
	docker build -t ${DOCKER_EMAIL_IMAGE} ./email
 
build_public:
	cd public
	docker build -t ${DOCKER_PUBLIC_IMAGE} ./public

start_environment:
	make build
	docker-compose up -d

stop_environment:
	docker-compose down

ci_public:
	cd public && npm ci && npm run lint && npm run test

ci_email:
	cd email && npm ci && npm run lint && npm run test

ci_subscription:
	cd subscription && npm ci && npm run lint && npm run test

.PHONY: all test clean start_environment stop_environment