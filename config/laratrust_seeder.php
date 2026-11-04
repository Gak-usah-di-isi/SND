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
        'editor' => [
            'abstracts' => 'r,u',
            'profile' => 'r,u',
        ],
        'reviewer' => [
            'abstracts' => 'r,u',
            'profile' => 'r,u',
        ],
        'presenter' => [
            'abstracts' => 'c,r,u,d',
            'payments' => 'c',
            'profile' => 'r,u',
        ],
        'executive' => [
            'participants' => 'r',
            'reviewer' => 'r',
            'payments' => 'r',
            'symposiums' => 'r',
            'abstracts' => 'r',
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
