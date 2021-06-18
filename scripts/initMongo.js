db = new Mongo().getDB("adidas");

db.createCollection('subscriptions', { capped: false });

