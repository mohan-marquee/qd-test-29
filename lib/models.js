module.exports = {
  "models": {
    "public": {
      "testTable1": {
        "properties": {
          "schema_name": "public",
          "table_name": "testTable1",
          "columns": {
            "updated_at": {
              "id": 3,
              "type": "timestamp with time zone",
              "default": "now()",
              "not_null": true,
              "primary": false,
              "foreign": false,
              "fk_col": null,
              "unique": false
            },
            "created_at": {
              "id": 2,
              "type": "timestamp with time zone",
              "default": "now()",
              "not_null": true,
              "primary": false,
              "foreign": false,
              "fk_col": null,
              "unique": false
            },
            "id": {
              "id": 1,
              "type": "uuid",
              "default": "gen_random_uuid()",
              "not_null": true,
              "primary": true,
              "foreign": false,
              "fk_col": null,
              "unique": false
            },
            "timezone": {
              "id": 8,
              "type": "character varying(255)",
              "default": null,
              "not_null": true,
              "primary": false,
              "foreign": false,
              "fk_col": null,
              "unique": false
            },
            "email": {
              "id": 7,
              "type": "character varying(255)",
              "default": null,
              "not_null": true,
              "primary": false,
              "foreign": false,
              "fk_col": null,
              "unique": false
            },
            "name": {
              "id": 6,
              "type": "character varying(255)",
              "default": null,
              "not_null": true,
              "primary": false,
              "foreign": false,
              "fk_col": null,
              "unique": false
            },
            "last_updated_by": {
              "id": 5,
              "type": "uuid",
              "default": null,
              "not_null": true,
              "primary": false,
              "foreign": false,
              "fk_col": null,
              "unique": false
            },
            "created_by": {
              "id": 4,
              "type": "uuid",
              "default": null,
              "not_null": true,
              "primary": false,
              "foreign": false,
              "fk_col": null,
              "unique": false
            }
          },
          "id": 18925806,
          "primary": [
            "id"
          ],
          "unique": [],
          "relations": {},
          "referencedBy": {},
          "uindex": {},
          "notnulls": [
            "updated_at",
            "created_at",
            "id",
            "timezone",
            "email",
            "name",
            "last_updated_by",
            "created_by"
          ],
          "serials": [],
          "idToName": {
            "1": "id",
            "2": "created_at",
            "3": "updated_at",
            "4": "created_by",
            "5": "last_updated_by",
            "6": "name",
            "7": "email",
            "8": "timezone"
          },
          "rels": {},
          "rels_new": {}
        }
      },
      "fake_table": {
        "properties": {
          "schema_name": "public",
          "table_name": "fake_table",
          "columns": {
            "username": {
              "id": 2,
              "type": "character varying(50)",
              "default": null,
              "not_null": true,
              "primary": false,
              "foreign": false,
              "fk_col": null,
              "unique": true
            },
            "user_id": {
              "id": 1,
              "type": "integer",
              "default": "nextval('fake_table_user_id_seq'::regclass)",
              "not_null": true,
              "primary": true,
              "foreign": false,
              "fk_col": null,
              "unique": false
            }
          },
          "id": 18856506,
          "primary": [
            "user_id"
          ],
          "unique": [
            "username"
          ],
          "relations": {},
          "referencedBy": {},
          "uindex": {
            "fake_table_username_key": [
              "username"
            ]
          },
          "notnulls": [
            "username",
            "user_id"
          ],
          "serials": [
            "user_id"
          ],
          "idToName": {
            "1": "user_id",
            "2": "username"
          },
          "rels": {},
          "rels_new": {}
        }
      },
      "store": {
        "properties": {
          "schema_name": "public",
          "table_name": "store",
          "columns": {
            "manager_staff_id": {
              "id": 2,
              "type": "smallint",
              "default": null,
              "not_null": true,
              "primary": false,
              "foreign": true,
              "fk_col": "public.staff.staff_id",
              "unique": false
            },
            "last_update": {
              "id": 4,
              "type": "timestamp without time zone",
              "default": "now()",
              "not_null": true,
              "primary": false,
              "foreign": false,
              "fk_col": null,
              "unique": false
            },
            "store_id": {
              "id": 1,
              "type": "integer",
              "default": "nextval('store_store_id_seq'::regclass)",
              "not_null": true,
              "primary": true,
              "foreign": false,
              "fk_col": null,
              "unique": false
            },
            "address_id": {
              "id": 3,
              "type": "smallint",
              "default": null,
              "not_null": true,
              "primary": false,
              "foreign": true,
              "fk_col": "public.address.address_id",
              "unique": false
            }
          },
          "id": 15575229,
          "primary": [
            "store_id"
          ],
          "unique": [],
          "relations": {
            "manager_staff_id": "public.staff.staff_id",
            "address_id": "public.address.address_id"
          },
          "referencedBy": {},
          "uindex": {},
          "notnulls": [
            "manager_staff_id",
            "last_update",
            "store_id",
            "address_id"
          ],
          "serials": [
            "store_id"
          ],
          "idToName": {
            "1": "store_id",
            "2": "manager_staff_id",
            "3": "address_id",
            "4": "last_update"
          },
          "rels": {
            "public.store.manager_staff_id-public.staff.staff_id": "M-1",
            "public.store.address_id-public.address.address_id": "M-1"
          },
          "rels_new": {
            "public.store.manager_staff_id-public.staff.staff_id": {
              "type": "M-1",
              "direct": "out"
            },
            "public.store.address_id-public.address.address_id": {
              "type": "M-1",
              "direct": "out"
            }
          }
        }
      },
      "staff": {
        "properties": {
          "schema_name": "public",
          "table_name": "staff",
          "columns": {
            "last_update": {
              "id": 10,
              "type": "timestamp without time zone",
              "default": "now()",
              "not_null": true,
              "primary": false,
              "foreign": false,
              "fk_col": null,
              "unique": false
            },
            "last_name": {
              "id": 3,
              "type": "character varying(45)",
              "default": null,
              "not_null": true,
              "primary": false,
              "foreign": false,
              "fk_col": null,
              "unique": false
            },
            "address_id": {
              "id": 4,
              "type": "smallint",
              "default": null,
              "not_null": true,
              "primary": false,
              "foreign": true,
              "fk_col": "public.address.address_id",
              "unique": false
            },
            "staff_id": {
              "id": 1,
              "type": "integer",
              "default": "nextval('staff_staff_id_seq'::regclass)",
              "not_null": true,
              "primary": true,
              "foreign": false,
              "fk_col": null,
              "unique": false
            },
            "first_name": {
              "id": 2,
              "type": "character varying(45)",
              "default": null,
              "not_null": true,
              "primary": false,
              "foreign": false,
              "fk_col": null,
              "unique": false
            },
            "email": {
              "id": 5,
              "type": "character varying(50)",
              "default": null,
              "not_null": false,
              "primary": false,
              "foreign": false,
              "fk_col": null,
              "unique": false
            },
            "store_id": {
              "id": 6,
              "type": "smallint",
              "default": null,
              "not_null": true,
              "primary": false,
              "foreign": false,
              "fk_col": null,
              "unique": false
            },
            "active": {
              "id": 7,
              "type": "boolean",
              "default": "true",
              "not_null": true,
              "primary": false,
              "foreign": false,
              "fk_col": null,
              "unique": false
            },
            "username": {
              "id": 8,
              "type": "character varying(16)",
              "default": null,
              "not_null": true,
              "primary": false,
              "foreign": false,
              "fk_col": null,
              "unique": false
            },
            "picture": {
              "id": 11,
              "type": "bytea",
              "default": null,
              "not_null": false,
              "primary": false,
              "foreign": false,
              "fk_col": null,
              "unique": false
            },
            "password": {
              "id": 9,
              "type": "character varying(40)",
              "default": null,
              "not_null": false,
              "primary": false,
              "foreign": false,
              "fk_col": null,
              "unique": false
            }
          },
          "id": 15575218,
          "primary": [
            "staff_id"
          ],
          "unique": [],
          "relations": {
            "address_id": "public.address.address_id"
          },
          "referencedBy": {
            "staff_id": [
              "public.store.manager_staff_id",
              "public.rental.staff_id",
              "public.payment.staff_id"
            ]
          },
          "uindex": {},
          "notnulls": [
            "last_update",
            "last_name",
            "address_id",
            "staff_id",
            "first_name",
            "store_id",
            "active",
            "username"
          ],
          "serials": [
            "staff_id"
          ],
          "idToName": {
            "1": "staff_id",
            "2": "first_name",
            "3": "last_name",
            "4": "address_id",
            "5": "email",
            "6": "store_id",
            "7": "active",
            "8": "username",
            "9": "password",
            "10": "last_update",
            "11": "picture"
          },
          "rels": {
            "public.staff.staff_id-public.store.manager_staff_id": "1-M",
            "public.staff.address_id-public.address.address_id": "M-1",
            "public.staff.staff_id-public.rental.staff_id": "1-M",
            "public.staff.staff_id-public.payment.staff_id": "1-M"
          },
          "rels_new": {
            "public.staff.staff_id-public.store.manager_staff_id": {
              "type": "1-M",
              "direct": "in"
            },
            "public.staff.address_id-public.address.address_id": {
              "type": "M-1",
              "direct": "out"
            },
            "public.staff.staff_id-public.rental.staff_id": {
              "type": "1-M",
              "direct": "in"
            },
            "public.staff.staff_id-public.payment.staff_id": {
              "type": "1-M",
              "direct": "in"
            }
          }
        }
      },
      "rental": {
        "properties": {
          "schema_name": "public",
          "table_name": "rental",
          "columns": {
            "inventory_id": {
              "id": 3,
              "type": "integer",
              "default": null,
              "not_null": true,
              "primary": false,
              "foreign": true,
              "fk_col": "public.inventory.inventory_id",
              "unique": false
            },
            "rental_id": {
              "id": 1,
              "type": "integer",
              "default": "nextval('rental_rental_id_seq'::regclass)",
              "not_null": true,
              "primary": true,
              "foreign": false,
              "fk_col": null,
              "unique": false
            },
            "rental_date": {
              "id": 2,
              "type": "timestamp without time zone",
              "default": null,
              "not_null": true,
              "primary": false,
              "foreign": false,
              "fk_col": null,
              "unique": false
            },
            "customer_id": {
              "id": 4,
              "type": "smallint",
              "default": null,
              "not_null": true,
              "primary": false,
              "foreign": true,
              "fk_col": "public.customer.customer_id",
              "unique": false
            },
            "return_date": {
              "id": 5,
              "type": "timestamp without time zone",
              "default": null,
              "not_null": false,
              "primary": false,
              "foreign": false,
              "fk_col": null,
              "unique": false
            },
            "staff_id": {
              "id": 6,
              "type": "smallint",
              "default": null,
              "not_null": true,
              "primary": false,
              "foreign": true,
              "fk_col": "public.staff.staff_id",
              "unique": false
            },
            "last_update": {
              "id": 7,
              "type": "timestamp without time zone",
              "default": "now()",
              "not_null": true,
              "primary": false,
              "foreign": false,
              "fk_col": null,
              "unique": false
            }
          },
          "id": 15575206,
          "primary": [
            "rental_id"
          ],
          "unique": [],
          "relations": {
            "inventory_id": "public.inventory.inventory_id",
            "customer_id": "public.customer.customer_id",
            "staff_id": "public.staff.staff_id"
          },
          "referencedBy": {
            "rental_id": [
              "public.payment.rental_id"
            ]
          },
          "uindex": {},
          "notnulls": [
            "inventory_id",
            "rental_id",
            "rental_date",
            "customer_id",
            "staff_id",
            "last_update"
          ],
          "serials": [
            "rental_id"
          ],
          "idToName": {
            "1": "rental_id",
            "2": "rental_date",
            "3": "inventory_id",
            "4": "customer_id",
            "5": "return_date",
            "6": "staff_id",
            "7": "last_update"
          },
          "rels": {
            "public.rental.inventory_id-public.inventory.inventory_id": "M-1",
            "public.rental.customer_id-public.customer.customer_id": "M-1",
            "public.rental.staff_id-public.staff.staff_id": "M-1",
            "public.rental.rental_id-public.payment.rental_id": "1-M"
          },
          "rels_new": {
            "public.rental.inventory_id-public.inventory.inventory_id": {
              "type": "M-1",
              "direct": "out"
            },
            "public.rental.customer_id-public.customer.customer_id": {
              "type": "M-1",
              "direct": "out"
            },
            "public.rental.staff_id-public.staff.staff_id": {
              "type": "M-1",
              "direct": "out"
            },
            "public.rental.rental_id-public.payment.rental_id": {
              "type": "1-M",
              "direct": "in"
            }
          }
        }
      },
      "payment": {
        "properties": {
          "schema_name": "public",
          "table_name": "payment",
          "columns": {
            "staff_id": {
              "id": 3,
              "type": "smallint",
              "default": null,
              "not_null": true,
              "primary": false,
              "foreign": true,
              "fk_col": "public.staff.staff_id",
              "unique": false
            },
            "rental_id": {
              "id": 4,
              "type": "integer",
              "default": null,
              "not_null": true,
              "primary": false,
              "foreign": true,
              "fk_col": "public.rental.rental_id",
              "unique": false
            },
            "payment_date": {
              "id": 6,
              "type": "timestamp without time zone",
              "default": null,
              "not_null": true,
              "primary": false,
              "foreign": false,
              "fk_col": null,
              "unique": false
            },
            "payment_id": {
              "id": 1,
              "type": "integer",
              "default": "nextval('payment_payment_id_seq'::regclass)",
              "not_null": true,
              "primary": true,
              "foreign": false,
              "fk_col": null,
              "unique": false
            },
            "customer_id": {
              "id": 2,
              "type": "smallint",
              "default": null,
              "not_null": true,
              "primary": false,
              "foreign": true,
              "fk_col": "public.customer.customer_id",
              "unique": false
            },
            "amount": {
              "id": 5,
              "type": "numeric(5,2)",
              "default": null,
              "not_null": true,
              "primary": false,
              "foreign": false,
              "fk_col": null,
              "unique": false
            }
          },
          "id": 15575200,
          "primary": [
            "payment_id"
          ],
          "unique": [],
          "relations": {
            "staff_id": "public.staff.staff_id",
            "rental_id": "public.rental.rental_id",
            "customer_id": "public.customer.customer_id"
          },
          "referencedBy": {},
          "uindex": {},
          "notnulls": [
            "staff_id",
            "rental_id",
            "payment_date",
            "payment_id",
            "customer_id",
            "amount"
          ],
          "serials": [
            "payment_id"
          ],
          "idToName": {
            "1": "payment_id",
            "2": "customer_id",
            "3": "staff_id",
            "4": "rental_id",
            "5": "amount",
            "6": "payment_date"
          },
          "rels": {
            "public.payment.staff_id-public.staff.staff_id": "M-1",
            "public.payment.rental_id-public.rental.rental_id": "M-1",
            "public.payment.customer_id-public.customer.customer_id": "M-1"
          },
          "rels_new": {
            "public.payment.staff_id-public.staff.staff_id": {
              "type": "M-1",
              "direct": "out"
            },
            "public.payment.rental_id-public.rental.rental_id": {
              "type": "M-1",
              "direct": "out"
            },
            "public.payment.customer_id-public.customer.customer_id": {
              "type": "M-1",
              "direct": "out"
            }
          }
        }
      },
      "language": {
        "properties": {
          "schema_name": "public",
          "table_name": "language",
          "columns": {
            "language_id": {
              "id": 1,
              "type": "integer",
              "default": "nextval('language_language_id_seq'::regclass)",
              "not_null": true,
              "primary": true,
              "foreign": false,
              "fk_col": null,
              "unique": false
            },
            "name": {
              "id": 2,
              "type": "character(20)",
              "default": null,
              "not_null": true,
              "primary": false,
              "foreign": false,
              "fk_col": null,
              "unique": false
            },
            "last_update": {
              "id": 3,
              "type": "timestamp without time zone",
              "default": "now()",
              "not_null": true,
              "primary": false,
              "foreign": false,
              "fk_col": null,
              "unique": false
            }
          },
          "id": 15575188,
          "primary": [
            "language_id"
          ],
          "unique": [],
          "relations": {},
          "referencedBy": {
            "language_id": [
              "public.film.language_id"
            ]
          },
          "uindex": {},
          "notnulls": [
            "language_id",
            "name",
            "last_update"
          ],
          "serials": [
            "language_id"
          ],
          "idToName": {
            "1": "language_id",
            "2": "name",
            "3": "last_update"
          },
          "rels": {
            "public.language.language_id-public.film.language_id": "1-M"
          },
          "rels_new": {
            "public.language.language_id-public.film.language_id": {
              "type": "1-M",
              "direct": "in"
            }
          }
        }
      },
      "inventory": {
        "properties": {
          "schema_name": "public",
          "table_name": "inventory",
          "columns": {
            "film_id": {
              "id": 2,
              "type": "smallint",
              "default": null,
              "not_null": true,
              "primary": false,
              "foreign": true,
              "fk_col": "public.film.film_id",
              "unique": false
            },
            "last_update": {
              "id": 4,
              "type": "timestamp without time zone",
              "default": "now()",
              "not_null": true,
              "primary": false,
              "foreign": false,
              "fk_col": null,
              "unique": false
            },
            "inventory_id": {
              "id": 1,
              "type": "integer",
              "default": "nextval('inventory_inventory_id_seq'::regclass)",
              "not_null": true,
              "primary": true,
              "foreign": false,
              "fk_col": null,
              "unique": false
            },
            "store_id": {
              "id": 3,
              "type": "smallint",
              "default": null,
              "not_null": true,
              "primary": false,
              "foreign": false,
              "fk_col": null,
              "unique": false
            }
          },
          "id": 15575181,
          "primary": [
            "inventory_id"
          ],
          "unique": [],
          "relations": {
            "film_id": "public.film.film_id"
          },
          "referencedBy": {
            "inventory_id": [
              "public.rental.inventory_id"
            ]
          },
          "uindex": {},
          "notnulls": [
            "film_id",
            "last_update",
            "inventory_id",
            "store_id"
          ],
          "serials": [
            "inventory_id"
          ],
          "idToName": {
            "1": "inventory_id",
            "2": "film_id",
            "3": "store_id",
            "4": "last_update"
          },
          "rels": {
            "public.inventory.inventory_id-public.rental.inventory_id": "1-M",
            "public.inventory.film_id-public.film.film_id": "M-1"
          },
          "rels_new": {
            "public.inventory.inventory_id-public.rental.inventory_id": {
              "type": "1-M",
              "direct": "in"
            },
            "public.inventory.film_id-public.film.film_id": {
              "type": "M-1",
              "direct": "out"
            }
          }
        }
      },
      "country": {
        "properties": {
          "schema_name": "public",
          "table_name": "country",
          "columns": {
            "country": {
              "id": 2,
              "type": "character varying(50)",
              "default": null,
              "not_null": true,
              "primary": false,
              "foreign": false,
              "fk_col": null,
              "unique": false
            },
            "country_id": {
              "id": 1,
              "type": "integer",
              "default": "nextval('country_country_id_seq'::regclass)",
              "not_null": true,
              "primary": true,
              "foreign": false,
              "fk_col": null,
              "unique": false
            },
            "last_update": {
              "id": 3,
              "type": "timestamp without time zone",
              "default": "now()",
              "not_null": true,
              "primary": false,
              "foreign": false,
              "fk_col": null,
              "unique": false
            }
          },
          "id": 15575164,
          "primary": [
            "country_id"
          ],
          "unique": [],
          "relations": {},
          "referencedBy": {
            "country_id": [
              "public.city.country_id"
            ]
          },
          "uindex": {},
          "notnulls": [
            "country",
            "country_id",
            "last_update"
          ],
          "serials": [
            "country_id"
          ],
          "idToName": {
            "1": "country_id",
            "2": "country",
            "3": "last_update"
          },
          "rels": {
            "public.country.country_id-public.city.country_id": "1-M"
          },
          "rels_new": {
            "public.country.country_id-public.city.country_id": {
              "type": "1-M",
              "direct": "in"
            }
          }
        }
      },
      "city": {
        "properties": {
          "schema_name": "public",
          "table_name": "city",
          "columns": {
            "city": {
              "id": 2,
              "type": "character varying(50)",
              "default": null,
              "not_null": true,
              "primary": false,
              "foreign": false,
              "fk_col": null,
              "unique": false
            },
            "city_id": {
              "id": 1,
              "type": "integer",
              "default": "nextval('city_city_id_seq'::regclass)",
              "not_null": true,
              "primary": true,
              "foreign": false,
              "fk_col": null,
              "unique": false
            },
            "last_update": {
              "id": 4,
              "type": "timestamp without time zone",
              "default": "now()",
              "not_null": true,
              "primary": false,
              "foreign": false,
              "fk_col": null,
              "unique": false
            },
            "country_id": {
              "id": 3,
              "type": "smallint",
              "default": null,
              "not_null": true,
              "primary": false,
              "foreign": true,
              "fk_col": "public.country.country_id",
              "unique": false
            }
          },
          "id": 15575157,
          "primary": [
            "city_id"
          ],
          "unique": [],
          "relations": {
            "country_id": "public.country.country_id"
          },
          "referencedBy": {
            "city_id": [
              "public.address.city_id"
            ]
          },
          "uindex": {},
          "notnulls": [
            "city",
            "city_id",
            "last_update",
            "country_id"
          ],
          "serials": [
            "city_id"
          ],
          "idToName": {
            "1": "city_id",
            "2": "city",
            "3": "country_id",
            "4": "last_update"
          },
          "rels": {
            "public.city.country_id-public.country.country_id": "M-1",
            "public.city.city_id-public.address.city_id": "1-M"
          },
          "rels_new": {
            "public.city.country_id-public.country.country_id": {
              "type": "M-1",
              "direct": "out"
            },
            "public.city.city_id-public.address.city_id": {
              "type": "1-M",
              "direct": "in"
            }
          }
        }
      },
      "address": {
        "properties": {
          "schema_name": "public",
          "table_name": "address",
          "columns": {
            "address_id": {
              "id": 1,
              "type": "integer",
              "default": "nextval('address_address_id_seq'::regclass)",
              "not_null": true,
              "primary": true,
              "foreign": false,
              "fk_col": null,
              "unique": false
            },
            "district": {
              "id": 4,
              "type": "character varying(20)",
              "default": null,
              "not_null": true,
              "primary": false,
              "foreign": false,
              "fk_col": null,
              "unique": false
            },
            "address2": {
              "id": 3,
              "type": "character varying(50)",
              "default": null,
              "not_null": false,
              "primary": false,
              "foreign": false,
              "fk_col": null,
              "unique": false
            },
            "address": {
              "id": 2,
              "type": "character varying(50)",
              "default": null,
              "not_null": true,
              "primary": false,
              "foreign": false,
              "fk_col": null,
              "unique": false
            },
            "last_update": {
              "id": 8,
              "type": "timestamp without time zone",
              "default": "now()",
              "not_null": true,
              "primary": false,
              "foreign": false,
              "fk_col": null,
              "unique": false
            },
            "phone": {
              "id": 7,
              "type": "character varying(20)",
              "default": null,
              "not_null": true,
              "primary": false,
              "foreign": false,
              "fk_col": null,
              "unique": false
            },
            "postal_code": {
              "id": 6,
              "type": "character varying(10)",
              "default": null,
              "not_null": false,
              "primary": false,
              "foreign": false,
              "fk_col": null,
              "unique": false
            },
            "city_id": {
              "id": 5,
              "type": "smallint",
              "default": null,
              "not_null": true,
              "primary": false,
              "foreign": true,
              "fk_col": "public.city.city_id",
              "unique": false
            }
          },
          "id": 15575149,
          "primary": [
            "address_id"
          ],
          "unique": [],
          "relations": {
            "city_id": "public.city.city_id"
          },
          "referencedBy": {
            "address_id": [
              "public.store.address_id",
              "public.staff.address_id",
              "public.customer.address_id"
            ]
          },
          "uindex": {},
          "notnulls": [
            "address_id",
            "district",
            "address",
            "last_update",
            "phone",
            "city_id"
          ],
          "serials": [
            "address_id"
          ],
          "idToName": {
            "1": "address_id",
            "2": "address",
            "3": "address2",
            "4": "district",
            "5": "city_id",
            "6": "postal_code",
            "7": "phone",
            "8": "last_update"
          },
          "rels": {
            "public.address.address_id-public.store.address_id": "1-M",
            "public.address.address_id-public.staff.address_id": "1-M",
            "public.address.city_id-public.city.city_id": "M-1",
            "public.address.address_id-public.customer.address_id": "1-M"
          },
          "rels_new": {
            "public.address.address_id-public.store.address_id": {
              "type": "1-M",
              "direct": "in"
            },
            "public.address.address_id-public.staff.address_id": {
              "type": "1-M",
              "direct": "in"
            },
            "public.address.city_id-public.city.city_id": {
              "type": "M-1",
              "direct": "out"
            },
            "public.address.address_id-public.customer.address_id": {
              "type": "1-M",
              "direct": "in"
            }
          }
        }
      },
      "film_category": {
        "properties": {
          "schema_name": "public",
          "table_name": "film_category",
          "columns": {
            "film_id": {
              "id": 1,
              "type": "smallint",
              "default": null,
              "not_null": true,
              "primary": false,
              "foreign": true,
              "fk_col": "public.film.film_id",
              "unique": false
            },
            "last_update": {
              "id": 3,
              "type": "timestamp without time zone",
              "default": "now()",
              "not_null": true,
              "primary": false,
              "foreign": false,
              "fk_col": null,
              "unique": false
            },
            "category_id": {
              "id": 2,
              "type": "smallint",
              "default": null,
              "not_null": true,
              "primary": false,
              "foreign": true,
              "fk_col": "public.category.category_id",
              "unique": false
            }
          },
          "id": 15575138,
          "primary": [
            "film_id",
            "category_id"
          ],
          "unique": [],
          "relations": {
            "film_id": "public.film.film_id",
            "category_id": "public.category.category_id"
          },
          "referencedBy": {},
          "uindex": {},
          "notnulls": [
            "film_id",
            "last_update",
            "category_id"
          ],
          "serials": [],
          "idToName": {
            "1": "film_id",
            "2": "category_id",
            "3": "last_update"
          },
          "rels": {
            "public.film_category.film_id-public.film.film_id": "M-1",
            "public.film_category.category_id-public.category.category_id": "M-1"
          },
          "rels_new": {
            "public.film_category.film_id-public.film.film_id": {
              "type": "M-1",
              "direct": "out"
            },
            "public.film_category.category_id-public.category.category_id": {
              "type": "M-1",
              "direct": "out"
            }
          }
        }
      },
      "film_actor": {
        "properties": {
          "schema_name": "public",
          "table_name": "film_actor",
          "columns": {
            "last_update": {
              "id": 3,
              "type": "timestamp without time zone",
              "default": "now()",
              "not_null": true,
              "primary": false,
              "foreign": false,
              "fk_col": null,
              "unique": false
            },
            "actor_id": {
              "id": 1,
              "type": "smallint",
              "default": null,
              "not_null": true,
              "primary": true,
              "foreign": true,
              "fk_col": "public.actor.actor_id",
              "unique": false
            },
            "film_id": {
              "id": 2,
              "type": "smallint",
              "default": null,
              "not_null": true,
              "primary": false,
              "foreign": true,
              "fk_col": "public.film.film_id",
              "unique": false
            }
          },
          "id": 15575134,
          "primary": [
            "actor_id",
            "film_id"
          ],
          "unique": [],
          "relations": {
            "actor_id": "public.actor.actor_id",
            "film_id": "public.film.film_id"
          },
          "referencedBy": {},
          "uindex": {},
          "notnulls": [
            "last_update",
            "actor_id",
            "film_id"
          ],
          "serials": [],
          "idToName": {
            "1": "actor_id",
            "2": "film_id",
            "3": "last_update"
          },
          "rels": {
            "public.film_actor.actor_id-public.actor.actor_id": "M-1",
            "public.film_actor.film_id-public.film.film_id": "M-1"
          },
          "rels_new": {
            "public.film_actor.actor_id-public.actor.actor_id": {
              "type": "M-1",
              "direct": "out"
            },
            "public.film_actor.film_id-public.film.film_id": {
              "type": "M-1",
              "direct": "out"
            }
          }
        }
      },
      "film": {
        "properties": {
          "schema_name": "public",
          "table_name": "film",
          "columns": {
            "language_id": {
              "id": 5,
              "type": "smallint",
              "default": null,
              "not_null": true,
              "primary": false,
              "foreign": true,
              "fk_col": "public.language.language_id",
              "unique": false
            },
            "film_id": {
              "id": 1,
              "type": "integer",
              "default": "nextval('film_film_id_seq'::regclass)",
              "not_null": true,
              "primary": true,
              "foreign": false,
              "fk_col": null,
              "unique": false
            },
            "title": {
              "id": 2,
              "type": "character varying(255)",
              "default": null,
              "not_null": true,
              "primary": false,
              "foreign": false,
              "fk_col": null,
              "unique": false
            },
            "description": {
              "id": 3,
              "type": "text",
              "default": null,
              "not_null": false,
              "primary": false,
              "foreign": false,
              "fk_col": null,
              "unique": false
            },
            "release_year": {
              "id": 4,
              "type": "year",
              "default": null,
              "not_null": false,
              "primary": false,
              "foreign": false,
              "fk_col": null,
              "unique": false
            },
            "rental_duration": {
              "id": 6,
              "type": "smallint",
              "default": "3",
              "not_null": true,
              "primary": false,
              "foreign": false,
              "fk_col": null,
              "unique": false
            },
            "rental_rate": {
              "id": 7,
              "type": "numeric(4,2)",
              "default": "4.99",
              "not_null": true,
              "primary": false,
              "foreign": false,
              "fk_col": null,
              "unique": false
            },
            "length": {
              "id": 8,
              "type": "smallint",
              "default": null,
              "not_null": false,
              "primary": false,
              "foreign": false,
              "fk_col": null,
              "unique": false
            },
            "replacement_cost": {
              "id": 9,
              "type": "numeric(5,2)",
              "default": "19.99",
              "not_null": true,
              "primary": false,
              "foreign": false,
              "fk_col": null,
              "unique": false
            },
            "rating": {
              "id": 10,
              "type": "mpaa_rating",
              "default": "'G'::mpaa_rating",
              "not_null": false,
              "primary": false,
              "foreign": false,
              "fk_col": null,
              "unique": false
            },
            "last_update": {
              "id": 11,
              "type": "timestamp without time zone",
              "default": "now()",
              "not_null": true,
              "primary": false,
              "foreign": false,
              "fk_col": null,
              "unique": false
            },
            "special_features": {
              "id": 12,
              "type": "text[]",
              "default": null,
              "not_null": false,
              "primary": false,
              "foreign": false,
              "fk_col": null,
              "unique": false
            },
            "fulltext": {
              "id": 13,
              "type": "tsvector",
              "default": null,
              "not_null": true,
              "primary": false,
              "foreign": false,
              "fk_col": null,
              "unique": false
            }
          },
          "id": 15575122,
          "primary": [
            "film_id"
          ],
          "unique": [],
          "relations": {
            "language_id": "public.language.language_id"
          },
          "referencedBy": {
            "film_id": [
              "public.inventory.film_id",
              "public.film_category.film_id",
              "public.film_actor.film_id"
            ]
          },
          "uindex": {},
          "notnulls": [
            "language_id",
            "film_id",
            "title",
            "rental_duration",
            "rental_rate",
            "replacement_cost",
            "last_update",
            "fulltext"
          ],
          "serials": [
            "film_id"
          ],
          "idToName": {
            "1": "film_id",
            "2": "title",
            "3": "description",
            "4": "release_year",
            "5": "language_id",
            "6": "rental_duration",
            "7": "rental_rate",
            "8": "length",
            "9": "replacement_cost",
            "10": "rating",
            "11": "last_update",
            "12": "special_features",
            "13": "fulltext"
          },
          "rels": {
            "public.film.film_id-public.inventory.film_id": "1-M",
            "public.film.film_id-public.film_category.film_id": "1-M",
            "public.film.film_id-public.film_actor.film_id": "1-M",
            "public.film.language_id-public.language.language_id": "M-1"
          },
          "rels_new": {
            "public.film.film_id-public.inventory.film_id": {
              "type": "1-M",
              "direct": "in"
            },
            "public.film.film_id-public.film_category.film_id": {
              "type": "1-M",
              "direct": "in"
            },
            "public.film.film_id-public.film_actor.film_id": {
              "type": "1-M",
              "direct": "in"
            },
            "public.film.language_id-public.language.language_id": {
              "type": "M-1",
              "direct": "out"
            }
          }
        }
      },
      "category": {
        "properties": {
          "schema_name": "public",
          "table_name": "category",
          "columns": {
            "category_id": {
              "id": 1,
              "type": "integer",
              "default": "nextval('category_category_id_seq'::regclass)",
              "not_null": true,
              "primary": true,
              "foreign": false,
              "fk_col": null,
              "unique": false
            },
            "name": {
              "id": 2,
              "type": "character varying(25)",
              "default": null,
              "not_null": true,
              "primary": false,
              "foreign": false,
              "fk_col": null,
              "unique": false
            },
            "last_update": {
              "id": 3,
              "type": "timestamp without time zone",
              "default": "now()",
              "not_null": true,
              "primary": false,
              "foreign": false,
              "fk_col": null,
              "unique": false
            }
          },
          "id": 15575114,
          "primary": [
            "category_id"
          ],
          "unique": [],
          "relations": {},
          "referencedBy": {
            "category_id": [
              "public.film_category.category_id"
            ]
          },
          "uindex": {},
          "notnulls": [
            "category_id",
            "name",
            "last_update"
          ],
          "serials": [
            "category_id"
          ],
          "idToName": {
            "1": "category_id",
            "2": "name",
            "3": "last_update"
          },
          "rels": {
            "public.category.category_id-public.film_category.category_id": "1-M"
          },
          "rels_new": {
            "public.category.category_id-public.film_category.category_id": {
              "type": "1-M",
              "direct": "in"
            }
          }
        }
      },
      "actor": {
        "properties": {
          "schema_name": "public",
          "table_name": "actor",
          "columns": {
            "last_update": {
              "id": 4,
              "type": "timestamp without time zone",
              "default": "now()",
              "not_null": true,
              "primary": false,
              "foreign": false,
              "fk_col": null,
              "unique": false
            },
            "actor_id": {
              "id": 1,
              "type": "integer",
              "default": "nextval('actor_actor_id_seq'::regclass)",
              "not_null": true,
              "primary": true,
              "foreign": false,
              "fk_col": null,
              "unique": false
            },
            "first_name": {
              "id": 2,
              "type": "character varying(45)",
              "default": null,
              "not_null": true,
              "primary": false,
              "foreign": false,
              "fk_col": null,
              "unique": false
            },
            "last_name": {
              "id": 3,
              "type": "character varying(45)",
              "default": null,
              "not_null": true,
              "primary": false,
              "foreign": false,
              "fk_col": null,
              "unique": false
            }
          },
          "id": 15575107,
          "primary": [
            "actor_id"
          ],
          "unique": [],
          "relations": {},
          "referencedBy": {
            "actor_id": [
              "public.film_actor.actor_id"
            ]
          },
          "uindex": {},
          "notnulls": [
            "last_update",
            "actor_id",
            "first_name",
            "last_name"
          ],
          "serials": [
            "actor_id"
          ],
          "idToName": {
            "1": "actor_id",
            "2": "first_name",
            "3": "last_name",
            "4": "last_update"
          },
          "rels": {
            "public.actor.actor_id-public.film_actor.actor_id": "1-M"
          },
          "rels_new": {
            "public.actor.actor_id-public.film_actor.actor_id": {
              "type": "1-M",
              "direct": "in"
            }
          }
        }
      },
      "customer": {
        "properties": {
          "schema_name": "public",
          "table_name": "customer",
          "columns": {
            "customer_id": {
              "id": 1,
              "type": "integer",
              "default": "nextval('customer_customer_id_seq'::regclass)",
              "not_null": true,
              "primary": true,
              "foreign": false,
              "fk_col": null,
              "unique": false
            },
            "active": {
              "id": 10,
              "type": "integer",
              "default": null,
              "not_null": false,
              "primary": false,
              "foreign": false,
              "fk_col": null,
              "unique": false
            },
            "store_id": {
              "id": 2,
              "type": "smallint",
              "default": null,
              "not_null": true,
              "primary": false,
              "foreign": false,
              "fk_col": null,
              "unique": false
            },
            "first_name": {
              "id": 3,
              "type": "character varying(45)",
              "default": null,
              "not_null": true,
              "primary": false,
              "foreign": false,
              "fk_col": null,
              "unique": false
            },
            "last_name": {
              "id": 4,
              "type": "character varying(45)",
              "default": null,
              "not_null": true,
              "primary": false,
              "foreign": false,
              "fk_col": null,
              "unique": false
            },
            "email": {
              "id": 5,
              "type": "character varying(50)",
              "default": null,
              "not_null": false,
              "primary": false,
              "foreign": false,
              "fk_col": null,
              "unique": false
            },
            "address_id": {
              "id": 6,
              "type": "smallint",
              "default": null,
              "not_null": true,
              "primary": false,
              "foreign": true,
              "fk_col": "public.address.address_id",
              "unique": false
            },
            "activebool": {
              "id": 7,
              "type": "boolean",
              "default": "true",
              "not_null": true,
              "primary": false,
              "foreign": false,
              "fk_col": null,
              "unique": false
            },
            "create_date": {
              "id": 8,
              "type": "date",
              "default": "('now'::text)::date",
              "not_null": true,
              "primary": false,
              "foreign": false,
              "fk_col": null,
              "unique": false
            },
            "last_update": {
              "id": 9,
              "type": "timestamp without time zone",
              "default": "now()",
              "not_null": false,
              "primary": false,
              "foreign": false,
              "fk_col": null,
              "unique": false
            }
          },
          "id": 15575096,
          "primary": [
            "customer_id"
          ],
          "unique": [],
          "relations": {
            "address_id": "public.address.address_id"
          },
          "referencedBy": {
            "customer_id": [
              "public.rental.customer_id",
              "public.payment.customer_id"
            ]
          },
          "uindex": {},
          "notnulls": [
            "customer_id",
            "store_id",
            "first_name",
            "last_name",
            "address_id",
            "activebool",
            "create_date"
          ],
          "serials": [
            "customer_id"
          ],
          "idToName": {
            "1": "customer_id",
            "2": "store_id",
            "3": "first_name",
            "4": "last_name",
            "5": "email",
            "6": "address_id",
            "7": "activebool",
            "8": "create_date",
            "9": "last_update",
            "10": "active"
          },
          "rels": {
            "public.customer.customer_id-public.rental.customer_id": "1-M",
            "public.customer.customer_id-public.payment.customer_id": "1-M",
            "public.customer.address_id-public.address.address_id": "M-1"
          },
          "rels_new": {
            "public.customer.customer_id-public.rental.customer_id": {
              "type": "1-M",
              "direct": "in"
            },
            "public.customer.customer_id-public.payment.customer_id": {
              "type": "1-M",
              "direct": "in"
            },
            "public.customer.address_id-public.address.address_id": {
              "type": "M-1",
              "direct": "out"
            }
          }
        }
      }
    }
  },
  "idToName": {
    "18925806.3": [
      "public",
      "testTable1",
      "updated_at"
    ],
    "18925806.2": [
      "public",
      "testTable1",
      "created_at"
    ],
    "18925806.1": [
      "public",
      "testTable1",
      "id"
    ],
    "18925806.8": [
      "public",
      "testTable1",
      "timezone"
    ],
    "18925806.7": [
      "public",
      "testTable1",
      "email"
    ],
    "18925806.6": [
      "public",
      "testTable1",
      "name"
    ],
    "18925806.5": [
      "public",
      "testTable1",
      "last_updated_by"
    ],
    "18925806.4": [
      "public",
      "testTable1",
      "created_by"
    ],
    "18856506.2": [
      "public",
      "fake_table",
      "username"
    ],
    "18856506.1": [
      "public",
      "fake_table",
      "user_id"
    ],
    "15575229.2": [
      "public",
      "store",
      "manager_staff_id"
    ],
    "15575229.4": [
      "public",
      "store",
      "last_update"
    ],
    "15575229.1": [
      "public",
      "store",
      "store_id"
    ],
    "15575229.3": [
      "public",
      "store",
      "address_id"
    ],
    "15575218.10": [
      "public",
      "staff",
      "last_update"
    ],
    "15575218.3": [
      "public",
      "staff",
      "last_name"
    ],
    "15575218.4": [
      "public",
      "staff",
      "address_id"
    ],
    "15575218.1": [
      "public",
      "staff",
      "staff_id"
    ],
    "15575218.2": [
      "public",
      "staff",
      "first_name"
    ],
    "15575218.5": [
      "public",
      "staff",
      "email"
    ],
    "15575218.6": [
      "public",
      "staff",
      "store_id"
    ],
    "15575218.7": [
      "public",
      "staff",
      "active"
    ],
    "15575218.8": [
      "public",
      "staff",
      "username"
    ],
    "15575218.11": [
      "public",
      "staff",
      "picture"
    ],
    "15575218.9": [
      "public",
      "staff",
      "password"
    ],
    "15575206.3": [
      "public",
      "rental",
      "inventory_id"
    ],
    "15575206.1": [
      "public",
      "rental",
      "rental_id"
    ],
    "15575206.2": [
      "public",
      "rental",
      "rental_date"
    ],
    "15575206.4": [
      "public",
      "rental",
      "customer_id"
    ],
    "15575206.5": [
      "public",
      "rental",
      "return_date"
    ],
    "15575206.6": [
      "public",
      "rental",
      "staff_id"
    ],
    "15575206.7": [
      "public",
      "rental",
      "last_update"
    ],
    "15575200.3": [
      "public",
      "payment",
      "staff_id"
    ],
    "15575200.4": [
      "public",
      "payment",
      "rental_id"
    ],
    "15575200.6": [
      "public",
      "payment",
      "payment_date"
    ],
    "15575200.1": [
      "public",
      "payment",
      "payment_id"
    ],
    "15575200.2": [
      "public",
      "payment",
      "customer_id"
    ],
    "15575200.5": [
      "public",
      "payment",
      "amount"
    ],
    "15575188.1": [
      "public",
      "language",
      "language_id"
    ],
    "15575188.2": [
      "public",
      "language",
      "name"
    ],
    "15575188.3": [
      "public",
      "language",
      "last_update"
    ],
    "15575181.2": [
      "public",
      "inventory",
      "film_id"
    ],
    "15575181.4": [
      "public",
      "inventory",
      "last_update"
    ],
    "15575181.1": [
      "public",
      "inventory",
      "inventory_id"
    ],
    "15575181.3": [
      "public",
      "inventory",
      "store_id"
    ],
    "15575164.2": [
      "public",
      "country",
      "country"
    ],
    "15575164.1": [
      "public",
      "country",
      "country_id"
    ],
    "15575164.3": [
      "public",
      "country",
      "last_update"
    ],
    "15575157.2": [
      "public",
      "city",
      "city"
    ],
    "15575157.1": [
      "public",
      "city",
      "city_id"
    ],
    "15575157.4": [
      "public",
      "city",
      "last_update"
    ],
    "15575157.3": [
      "public",
      "city",
      "country_id"
    ],
    "15575149.1": [
      "public",
      "address",
      "address_id"
    ],
    "15575149.4": [
      "public",
      "address",
      "district"
    ],
    "15575149.3": [
      "public",
      "address",
      "address2"
    ],
    "15575149.2": [
      "public",
      "address",
      "address"
    ],
    "15575149.8": [
      "public",
      "address",
      "last_update"
    ],
    "15575149.7": [
      "public",
      "address",
      "phone"
    ],
    "15575149.6": [
      "public",
      "address",
      "postal_code"
    ],
    "15575149.5": [
      "public",
      "address",
      "city_id"
    ],
    "15575138.1": [
      "public",
      "film_category",
      "film_id"
    ],
    "15575138.3": [
      "public",
      "film_category",
      "last_update"
    ],
    "15575138.2": [
      "public",
      "film_category",
      "category_id"
    ],
    "15575134.3": [
      "public",
      "film_actor",
      "last_update"
    ],
    "15575134.1": [
      "public",
      "film_actor",
      "actor_id"
    ],
    "15575134.2": [
      "public",
      "film_actor",
      "film_id"
    ],
    "15575122.5": [
      "public",
      "film",
      "language_id"
    ],
    "15575122.1": [
      "public",
      "film",
      "film_id"
    ],
    "15575122.2": [
      "public",
      "film",
      "title"
    ],
    "15575122.3": [
      "public",
      "film",
      "description"
    ],
    "15575122.4": [
      "public",
      "film",
      "release_year"
    ],
    "15575122.6": [
      "public",
      "film",
      "rental_duration"
    ],
    "15575122.7": [
      "public",
      "film",
      "rental_rate"
    ],
    "15575122.8": [
      "public",
      "film",
      "length"
    ],
    "15575122.9": [
      "public",
      "film",
      "replacement_cost"
    ],
    "15575122.10": [
      "public",
      "film",
      "rating"
    ],
    "15575122.11": [
      "public",
      "film",
      "last_update"
    ],
    "15575122.12": [
      "public",
      "film",
      "special_features"
    ],
    "15575122.13": [
      "public",
      "film",
      "fulltext"
    ],
    "15575114.1": [
      "public",
      "category",
      "category_id"
    ],
    "15575114.2": [
      "public",
      "category",
      "name"
    ],
    "15575114.3": [
      "public",
      "category",
      "last_update"
    ],
    "15575107.4": [
      "public",
      "actor",
      "last_update"
    ],
    "15575107.1": [
      "public",
      "actor",
      "actor_id"
    ],
    "15575107.2": [
      "public",
      "actor",
      "first_name"
    ],
    "15575107.3": [
      "public",
      "actor",
      "last_name"
    ],
    "15575096.1": [
      "public",
      "customer",
      "customer_id"
    ],
    "15575096.10": [
      "public",
      "customer",
      "active"
    ],
    "15575096.2": [
      "public",
      "customer",
      "store_id"
    ],
    "15575096.3": [
      "public",
      "customer",
      "first_name"
    ],
    "15575096.4": [
      "public",
      "customer",
      "last_name"
    ],
    "15575096.5": [
      "public",
      "customer",
      "email"
    ],
    "15575096.6": [
      "public",
      "customer",
      "address_id"
    ],
    "15575096.7": [
      "public",
      "customer",
      "activebool"
    ],
    "15575096.8": [
      "public",
      "customer",
      "create_date"
    ],
    "15575096.9": [
      "public",
      "customer",
      "last_update"
    ]
  },
  "tidToName": {
    "15575096": [
      "public",
      "customer"
    ],
    "15575107": [
      "public",
      "actor"
    ],
    "15575114": [
      "public",
      "category"
    ],
    "15575122": [
      "public",
      "film"
    ],
    "15575134": [
      "public",
      "film_actor"
    ],
    "15575138": [
      "public",
      "film_category"
    ],
    "15575149": [
      "public",
      "address"
    ],
    "15575157": [
      "public",
      "city"
    ],
    "15575164": [
      "public",
      "country"
    ],
    "15575181": [
      "public",
      "inventory"
    ],
    "15575188": [
      "public",
      "language"
    ],
    "15575200": [
      "public",
      "payment"
    ],
    "15575206": [
      "public",
      "rental"
    ],
    "15575218": [
      "public",
      "staff"
    ],
    "15575229": [
      "public",
      "store"
    ],
    "18856506": [
      "public",
      "fake_table"
    ],
    "18925806": [
      "public",
      "testTable1"
    ]
  }
}