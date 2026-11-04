<?php

return [
    /**
     * Control if the seeder should create a user per role while seeding the data.
     */
    'create_users' => true,

    /**
     * Control if all the laratrust tables should be truncated before running the seeder.
     */
    'truncate_tables' => true,

    'roles_structure' => [
        'admin' => [
            'participants' => 'c,r,u,d',
            'reviewer' => 'c,r,u,d',
            'payments' => 'c,r,u,d',
            'symposiums' => 'c,r,u,d',
            'abstracts' => 'r,u,d',
            'certificates' => 'u',
            'profile' => 'r,u',
        ],
        'chief-editor' => [
            'abstracts' => 'r,u',
            'profile' => 'r,u',
        ],
        'editor' => [
            'abstracts' => 'r,u',
            'profile' => 'r,u',
        ],
        'reviewer' => [
            'abstracts' => 'r,u',
            'profile' => 'r,u',
        ],
        'indonesia-presenter' => [
            'profile' => 'r,u',
            'payments' => 'c',
            'abstracts' => 'c,r,u,d',
        ],
        'foreign-presenter' => [
            'profile' => 'r,u',
            'payments' => 'c',
            'abstracts' => 'c,r,u,d',
        ],
        'indonesia-participants' => [
            'profile' => 'r,u',
            'payments' => 'c',
            'abstracts' => 'c,r,u,d',
        ],
        'foreign-participants' => [
            'profile' => 'r,u',
            'payments' => 'c',
            'abstracts' => 'c,r,u,d',
        ],
        'landing-editor' => [
            'speakers' => 'c,r,u,d',
        ],
        'sekretaris' => [
            'participants' => 'r',
            'reviewer' => 'r',
            'payments' => 'r',
            'symposiums' => 'r',
            'abstracts' => 'r',
            'profile' => 'r,u',
        ],
        'humas' => [
            'participants' => 'r',
            'reviewer' => 'r',
            'payments' => 'r',
            'symposiums' => 'r',
            'abstracts' => 'r',
            'profile' => 'r,u',
        ],
        'bendahara' => [
            'payments' => 'r,u',
            'profile' => 'r,u',
        ],
    ],

    'permissions_map' => [
        'c' => 'create',
        'r' => 'read',
        'u' => 'update',
        'd' => 'delete',
    ],
];
