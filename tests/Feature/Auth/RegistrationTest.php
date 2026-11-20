<?php

namespace Tests\Feature\Auth;

use App\Models\Role;
use App\Models\User;
use Database\Seeders\DeploySeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(DeploySeeder::class);
    }

    public function test_registration_screen_can_be_rendered(): void
    {
        $response = $this->get('/register');

        $response->assertStatus(200);
    }

    public function test_new_users_can_register(): void
    {
        $role = Role::where('name', 'presenter')->firstOrFail();

        $response = $this->post('/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'institution' => 'Universitas Brawijaya',
            'job_title' => 'Dosen',
            'phone_number' => '081234567890',
            'attendance' => 'onsite',
            'country' => 'Indonesia',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'role_id' => $role->id,
            'is_student' => false,
        ]);

        $response->assertRedirect(route('login'));
        $this->assertGuest();
        $this->assertDatabaseHas('users', ['email' => 'test@example.com']);

        $user = User::where('email', 'test@example.com')->firstOrFail();
        $this->assertTrue($user->hasRole('presenter'));
    }
}
