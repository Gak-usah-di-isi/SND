<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Role;
use App\Models\Symposium;
use App\Models\PresentationType;
use App\Models\Sdg;
use App\Models\ConferenceSetting;
use App\Models\Year;
use Illuminate\Support\Facades\Hash;

class RbacSecurityAuditTest extends TestCase
{
    private function getUser(string $role): User
    {
        return User::whereHas('roles', fn($q) => $q->where('name', $role))->firstOrFail();
    }

    /**
     * Test 1: Presenter role access and boundaries
     */
    public function test_presenter_routes_and_protection(): void
    {
        $presenter = $this->getUser('presenter');

        $allowed = [
            '/dashboard',
            '/abstracts',
            '/final-paper',
            '/payment',
            '/profile',
        ];

        foreach ($allowed as $url) {
            $response = $this->actingAs($presenter)->get($url);
            $this->assertContains(
                $response->getStatusCode(),
                [200, 302],
                "Presenter should access $url, got {$response->getStatusCode()}"
            );
        }

        $forbidden = [
            '/admin/summary',
            '/admin/settings',
            '/admin/participant',
            '/admin/payment',
            '/executive',
            '/executive/participants',
            '/reviewer/summary',
            '/reviewer/all-abstract',
        ];

        foreach ($forbidden as $url) {
            $response = $this->actingAs($presenter)->get($url);
            $this->assertEquals(
                403,
                $response->getStatusCode(),
                "Presenter MUST be forbidden (403) from $url, got {$response->getStatusCode()}"
            );
        }
    }

    /**
     * Test 2: Admin role access and boundaries
     */
    public function test_admin_routes_and_protection(): void
    {
        $admin = $this->getUser('admin');

        $adminUrls = [
            '/admin/summary',
            '/admin/participant',
            '/admin/abstract',
            '/admin/oral',
            '/admin/sdgs',
            '/admin/symposium',
            '/admin/presentation-type',
            '/admin/abstract-book',
            '/admin/payment',
            '/admin/certificates',
            '/admin/reviewer',
            '/admin/email-csv',
            '/admin/download-files',
            '/admin/settings',
            '/admin/email-template',
            '/admin/regenerate-certificate',
            '/admin/broadcast/invitation',
            '/admin/broadcast/parallel-session',
            '/admin/broadcast/reminder',
            '/profile',
        ];

        foreach ($adminUrls as $url) {
            $response = $this->actingAs($admin)->get($url);
            $this->assertContains(
                $response->getStatusCode(),
                [200, 302],
                "Admin should access $url, got {$response->getStatusCode()}"
            );
        }

        $response = $this->actingAs($admin)->get('/executive');
        $this->assertEquals(403, $response->getStatusCode(), "Admin without executive role should get 403 on /executive");
    }

    /**
     * Test 3: Executive role access and boundaries
     */
    public function test_executive_routes_and_protection(): void
    {
        $executive = $this->getUser('executive');

        $executiveUrls = [
            '/executive',
            '/executive/participants',
            '/executive/abstracts',
            '/executive/payments',
            '/executive/reviewers',
            '/profile',
        ];

        foreach ($executiveUrls as $url) {
            $response = $this->actingAs($executive)->get($url);
            $this->assertContains(
                $response->getStatusCode(),
                [200, 302],
                "Executive should access $url, got {$response->getStatusCode()}"
            );
        }

        $forbidden = [
            '/admin/summary',
            '/admin/settings',
            '/admin/participant',
            '/abstracts',
            '/reviewer/summary',
        ];

        foreach ($forbidden as $url) {
            $response = $this->actingAs($executive)->get($url);
            $this->assertEquals(
                403,
                $response->getStatusCode(),
                "Executive MUST be forbidden (403) from $url, got {$response->getStatusCode()}"
            );
        }
    }

    /**
     * Test 4: Reviewer and Editor role access and boundaries
     */
    public function test_reviewer_and_editor_routes_and_protection(): void
    {
        $reviewer = $this->getUser('reviewer');
        $editor = $this->getUser('editor');

        $reviewerUrls = [
            '/reviewer/summary',
            '/reviewer/review-abstract',
            '/reviewer/review-abstract-completed',
            '/reviewer/review-fullpaper',
            '/reviewer/review-fullpaper-completed',
            '/profile',
        ];

        foreach ($reviewerUrls as $url) {
            $response = $this->actingAs($reviewer)->get($url);
            $this->assertContains(
                $response->getStatusCode(),
                [200, 302],
                "Reviewer should access $url, got {$response->getStatusCode()}"
            );
        }

        $editorUrls = [
            '/reviewer/summary',
            '/reviewer/all-abstract',
            '/reviewer/abstract-workload',
            '/reviewer/editor-abstract/no-reviewer',
            '/reviewer/editor-abstract/no-decision',
            '/reviewer/all-fullpaper',
            '/reviewer/fullpaper-workload',
            '/profile',
        ];

        foreach ($editorUrls as $url) {
            $response = $this->actingAs($editor)->get($url);
            $this->assertContains(
                $response->getStatusCode(),
                [200, 302],
                "Editor should access $url, got {$response->getStatusCode()}"
            );
        }

        foreach ([$reviewer, $editor] as $user) {
            foreach (['/admin/summary', '/admin/settings', '/executive', '/abstracts'] as $url) {
                $response = $this->actingAs($user)->get($url);
                $this->assertEquals(
                    403,
                    $response->getStatusCode(),
                    "User {$user->email} MUST be forbidden (403) from $url, got {$response->getStatusCode()}"
                );
            }
        }
    }

    /**
     * Test 5: Unauthenticated guest protection
     */
    public function test_unauthenticated_guests_redirected(): void
    {
        $protectedUrls = [
            '/dashboard',
            '/abstracts',
            '/admin/summary',
            '/executive',
            '/reviewer/summary',
            '/profile',
        ];

        foreach ($protectedUrls as $url) {
            $response = $this->get($url);
            $response->assertRedirect('/login');
        }
    }

    /**
     * Test 6: Registration flow as Presenter
     */
    public function test_user_registration_as_presenter(): void
    {
        $role = Role::where('name', 'presenter')->firstOrFail();
        $randomEmail = 'testpresenter_' . uniqid() . '@example.com';

        $payload = [
            'name' => 'Budi Presenter',
            'email' => $randomEmail,
            'institution' => 'Universitas Brawijaya',
            'job_title' => 'Dosen / Peneliti',
            'phone_number' => '08123456789',
            'attendance' => 'onsite',
            'country' => 'Indonesia',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'role_id' => $role->id,
            'is_student' => false,
        ];

        $response = $this->post('/register', $payload);

        $response->assertRedirect(route('login'));
        $this->assertDatabaseHas('users', ['email' => $randomEmail]);

        $createdUser = User::where('email', $randomEmail)->firstOrFail();
        $this->assertTrue($createdUser->hasRole('presenter'));
    }

    /**
     * Test 7: Abstract Creation flow by Presenter
     */
    public function test_presenter_can_submit_abstract(): void
    {
        $presenter = $this->getUser('presenter');
        \App\Models\AbstractModel::where('user_id', $presenter->id)->delete();
        $activeYear = Year::activeYear();

        $symposium = Symposium::firstOrCreate(
            ['name' => 'Symposium Agribisnis & Vokasi'],
            ['abbreviation' => 'SAV', 'created_at' => now()]
        );

        $sdg = Sdg::first();
        $sdgIds = $sdg ? [$sdg->id] : [];

        $payload = [
            'symposium_id' => $symposium->id,
            'title' => 'Inovasi Pertanian Presisi untuk Ketahanan Pangan Berkelanjutan ' . uniqid(),
            'authors' => 'Budi Santoso, Siti Aminah',
            'affiliations' => 'Fakultas Vokasi Universitas Brawijaya',
            'corresponding_email' => $presenter->email,
            'abstract' => 'Penelitian ini bertujuan untuk menganalisis efektivitas penerapan teknologi presisi dalam pertanian modern.',
            'keyword' => 'pertanian, teknologi, inovasi',
            'presentation_type' => 'Oral presentation',
            'sdg_ids' => $sdgIds,
        ];

        $response = $this->actingAs($presenter)->post('/abstracts', $payload);

        $response->assertRedirect(route('abstracts.index'));
        $this->assertDatabaseHas('abstracts', [
            'user_id' => $presenter->id,
            'title' => $payload['title'],
        ]);
    }

    /**
     * Test 8: Login redirection for each role
     */
    public function test_login_redirection_for_each_role(): void
    {
        $testCredentials = [
            'admin@app.test' => '/admin/summary',
            'editor@app.test' => '/reviewer/summary',
            'reviewer@app.test' => '/reviewer/summary',
            'presenter@app.test' => '/dashboard',
            'executive@app.test' => '/executive',
        ];

        foreach ($testCredentials as $email => $expectedUrl) {
            $user = User::where('email', $email)->firstOrFail();
            $user->password = Hash::make('password');
            $user->save();

            $response = $this->post('/login', [
                'email' => $email,
                'password' => 'password',
            ]);

            // Inertia::location returns 409 with X-Inertia-Location header, or 302 redirect
            if ($response->getStatusCode() === 409) {
                $location = $response->headers->get('X-Inertia-Location');
                $this->assertStringContainsString($expectedUrl, $location, "Role for $email should redirect to $expectedUrl");
            } else {
                $response->assertRedirect($expectedUrl);
            }

            $this->post('/logout');
        }
    }
}
