 <!-- partial:partials/_navbar.html -->
 <nav class="navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
     <div class="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
         <a class="navbar-brand brand-logo mr-5" href="index.html">
             <img src="{{ $logoPath }}" class="mr-2 w-10 h-15" alt="logo" />
         </a>
         <a class="navbar-brand brand-logo-mini" href="index.html"><img src="{{ $logoPath }}" alt="logo" /></a>
     </div>
     <div class="navbar-menu-wrapper d-flex align-items-center justify-content-end">
         <button class="navbar-toggler navbar-toggler align-self-center" type="button" data-toggle="minimize">
             <span class="icon-menu"></span>
         </button>
         <ul class="navbar-nav navbar-nav-right">
             <li class="nav-item nav-profile dropdown">
                 <a class="nav-link dropdown-toggle" href="#" data-toggle="dropdown" id="profileDropdown">
                     <img src="{{ auth()->check() && auth()->user()->profile_photo_path ? asset('storage/' . auth()->user()->profile_photo_path) : asset('./img/default-avatar.jpeg') }}"
                         alt="profile" />
                 </a>
                 <div class="dropdown-menu dropdown-menu-right navbar-dropdown" aria-labelledby="profileDropdown">
                     <a class="dropdown-item" href="{{ route('profile.edit') }}">
                         <i class="fa fa-user text-primary"></i>
                         Profile
                     </a>
                     <form method="POST" action="{{ route('logout') }}" id="logout-form" style="display: none;">
                         @csrf
                     </form>

                     <a class="dropdown-item" href="#"
                         onclick="event.preventDefault(); document.getElementById('logout-form').submit();">
                         <i class="ti-power-off text-primary"></i>
                         Logout
                     </a>
                 </div>
             </li>
         </ul>
         <button class="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button"
             data-toggle="offcanvas">
             <span class="icon-menu"></span>
         </button>
     </div>
 </nav>
