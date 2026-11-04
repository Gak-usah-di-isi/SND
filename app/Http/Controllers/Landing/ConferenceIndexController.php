<?php
namespace App\Http\Controllers\Landing;
use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ConferenceIndexController extends Controller
{
    public function index(){
        return Inertia::render('LandingEditor/ConferenceProgram/Index');
    }
}