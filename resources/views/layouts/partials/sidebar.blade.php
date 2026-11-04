@role('executive')
    <nav class="sidebar sidebar-offcanvas" id="sidebar">
        <ul class="nav">
            <li class="nav-item {{ request()->routeIs('executive.index') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('executive.index') }}">
                    <i class="fa fa-clone menu-icon"></i>
                    <span class="menu-title">Summary</span>
                </a>
            </li>
            <li class="nav-item {{ request()->routeIs('executive.participants') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('executive.participants') }}">
                    <i class="fa fa-users menu-icon"></i>
                    <span class="menu-title">Participants</span>
                </a>
            </li>
            <li class="nav-item {{ request()->routeIs('executive.abstracts') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('executive.abstracts') }}">
                    <i class="fa fa-book menu-icon"></i>
                    <span class="menu-title">Abstracts</span>
                </a>
            </li>
            <li class="nav-item {{ request()->routeIs('executive.payments') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('executive.payments') }}">
                    <i class="fa fa-credit-card-alt menu-icon"></i>
                    <span class="menu-title">Payment</span>
                    @php
                        $noVerified = \App\Models\FilePayment::where('status', 'pending')->count();
                    @endphp
                    <span class="badge {{ $noVerified > 0 ? 'badge-danger' : 'badge-secondary' }}">{{ $noVerified }}
                    </span>
                </a>
            </li>
            <li class="nav-item {{ request()->routeIs('executive.reviewers') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('executive.reviewers') }}">
                    <i class="fa fa-user menu-icon"></i>
                    <span class="menu-title">Reviewers</span>
                </a>
            </li>
        </ul>
    </nav>
@endrole

@role('admin')
    <nav class="sidebar sidebar-offcanvas" id="sidebar">
        <ul class="nav">
            <li class="nav-item {{ request()->routeIs('admin.summary') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('admin.summary') }}">
                    <i class="fa fa-clone menu-icon"></i>
                    <span class="menu-title">Summary</span>
                </a>
            </li>
            <li class="nav-item {{ request()->routeIs('admin.participant.index') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('admin.participant.index') }}">
                    <i class="fa fa-users menu-icon"></i>
                    <span class="menu-title">Participants</span>
                </a>
            </li>
            <li class="nav-item {{ request()->routeIs('admin.abstract.index') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('admin.abstract.index') }}">
                    <i class="fa fa-book menu-icon"></i>
                    <span class="menu-title">Abstracts</span>
                </a>
            </li>
            <li class="nav-item {{ request()->routeIs('admin.oral.index') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('admin.oral.index') }}">
                    <i class="fa fa-folder menu-icon"></i>
                    <span class="menu-title">Oral Distribution</span>
                </a>
            </li>
            <li class="nav-item {{ request()->routeIs('admin.symposium.index') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('admin.symposium.index') }}">
                    <i class="fa fa-columns menu-icon"></i>
                    <span class="menu-title">Symposiums</span>
                </a>
            </li>
            <li class="nav-item {{ request()->routeIs('admin.payment.index') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('admin.payment.index') }}">
                    <i class="fa fa-credit-card-alt menu-icon"></i>
                    <span class="menu-title">Payment</span>
                    @php
                        $noVerified = \App\Models\FilePayment::where('status', 'pending')->count();
                    @endphp
                    <span class="badge {{ $noVerified > 0 ? 'badge-danger' : 'badge-secondary' }}">{{ $noVerified }}
                    </span>
                </a>
            </li>
            <li class="nav-item {{ request()->routeIs('admin.manual-receipt.create') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('admin.manual-receipt.create') }}">
                    <i class="fa fa-file-text menu-icon"></i>
                    <span class="menu-title">Manual Receipt</span>
                </a>
            </li>
            <li class="nav-item {{ request()->routeIs('admin.certificates.index') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('admin.certificates.index') }}">
                    <i class="fa fa-file menu-icon"></i>
                    <span class="menu-title">Certificates</span>
                </a>
            </li>
            <li class="nav-item {{ request()->routeIs('admin.reviewer.index') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('admin.reviewer.index') }}">
                    <i class="fa fa-user menu-icon"></i>
                    <span class="menu-title">Reviewers</span>
                </a>
            </li>
            <li class="nav-item {{ request()->routeIs('admin.email.csv') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('admin.email.csv') }}">
                    <i class="fa fa-envelope menu-icon"></i>
                    <span class="menu-title">Email CSV</span>
                </a>
            </li>
            <li class="nav-item {{ request()->routeIs('admin.abstract.bySymposium') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('admin.abstract.bySymposium') }}">
                    <i class="fa fa-clipboard menu-icon"></i>
                    <span class="menu-title">Abstracts Book</span>
                </a>
            </li>
            <li class="nav-item {{ request()->routeIs('admin.download.index') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('admin.download.index') }}">
                    <i class="fa fa-download menu-icon"></i>
                    <span class="menu-title">Download Files</span>
                </a>
            </li>
            <li class="nav-item {{ request()->routeIs('admin.upload.index') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('admin.upload.index') }}">
                    <i class="fa fa-upload menu-icon"></i>
                    <span class="menu-title">Upload</span>
                </a>
            </li>
            <li class="nav-item {{ request()->routeIs('admin.settings.index') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('admin.settings.index') }}">
                    <i class="fa fa-cogs menu-icon"></i>
                    <span class="menu-title">Setting</span>
                </a>
            </li>
            <li class="nav-item {{ request()->routeIs('admin.years.index') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('admin.years.index') }}">
                    <i class="fa fa-calendar menu-icon"></i>
                    <span class="menu-title">Years</span>
                </a>
            </li>
            <li class="nav-item {{ request()->routeIs('admin.email-template.index') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('admin.email-template.index') }}">
                    <i class="fa fa-envelope menu-icon"></i>
                    <span class="menu-title">Edit Email Template</span>
                </a>
            </li>
            <li class="nav-item {{ request()->routeIs('admin.regenerate-certificate.index') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('admin.regenerate-certificate.index') }}">
                    <i class="fa fa-file menu-icon"></i>
                    <span class="menu-title">Regenerate Certificate</span>
                </a>
            </li>
        </ul>
    </nav>
@endrole

@role(['chief-editor', 'editor'])
    <nav class="sidebar sidebar-offcanvas" id="sidebar">
        <ul class="nav">
            <li class="nav-item {{ request()->routeIs('reviewer.summary') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('reviewer.summary') }}">
                    <i class="fa fa-clone menu-icon"></i>
                    <span class="menu-title">Summary</span>
                </a>
            </li>
            <li class="nav-item {{ request()->routeIs('reviewer.review-abstract.index') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('reviewer.review-abstract.index') }}">
                    <i class="fa fa-file-text menu-icon"></i>
                    <span class="menu-title">Review Abstract</span>
                    @php
                        $countPendingReviews = \App\Models\AbstractModel::whereHas('abstractReviews', function (
                            $query,
                        ) {
                            $query->where('reviewer_id', auth()->id());
                        })
                            ->whereIn('status', ['under review', 'revision'])
                            ->count();
                    @endphp
                    <span
                        class="badge {{ $countPendingReviews > 0 ? 'badge-danger' : 'badge-secondary' }}  ml-2">{{ $countPendingReviews }}</span>
                </a>
            </li>
            <li class="nav-item {{ request()->routeIs('reviewer.review.review-completed') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('reviewer.review.review-completed') }}">
                    <i class="fa fa-check-circle menu-icon"></i>
                    <span class="menu-title">Abstract Completed</span>
                    @php
                        $countCompletedReviews = \App\Models\AbstractModel::whereHas('abstractReviews', function (
                            $query,
                        ) {
                            $query->where('reviewer_id', auth()->id());
                        })
                            ->where('status', 'accepted')
                            ->count();
                    @endphp
                    <span
                        class="badge {{ $countCompletedReviews > 0 ? 'badge-success' : 'badge-secondary' }}  ml-2">{{ $countCompletedReviews }}</span>
                </a>
            </li>

            <li class="nav-item {{ request()->routeIs('reviewer.review-fullpaper.index') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('reviewer.review-fullpaper.index') }}">
                    <i class="fa fa-file-alt menu-icon"></i>
                    <span class="menu-title">Review Fullpaper</span>
                    @php
                        $countPendingPapers = \App\Models\FullPaper::whereHas('fullPaperReviews', function ($query) {
                            $query->where('reviewer_id', auth()->id());
                        })
                            ->whereIn('status', ['under review', 'revision'])
                            ->count();
                    @endphp
                    <span
                        class="badge {{ $countPendingPapers > 0 ? 'badge-danger' : 'badge-secondary' }} ml-2">{{ $countPendingPapers }}</span>
                </a>
            </li>
            <li class="nav-item {{ request()->routeIs('reviewer.review-fullpaper.review-completed') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('reviewer.review-fullpaper.review-completed') }}">
                    <i class="fa fa-check-double menu-icon"></i>
                    <span class="menu-title">Paper Completed </span>
                    @php
                        $countCompletedPapers = \App\Models\FullPaper::whereHas('fullPaperReviews', function ($query) {
                            $query->where('reviewer_id', auth()->id());
                        })
                            ->where('status', 'accepted')
                            ->count();
                    @endphp
                    <span
                        class="badge {{ $countCompletedPapers > 0 ? 'badge-success' : 'badge-secondary' }} ml-2">{{ $countCompletedPapers }}</span>
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" data-toggle="collapse" aria-expanded="false" aria-controls="charts">
                    <i class="fa fa-user-edit menu-icon"></i>
                    <span class="menu-title">Editor Abstract</span>
                    <i class="menu-arrow"></i>
                </a>
            </li>
            <li class="nav-item {{ request()->routeIs('reviewer.editor.noReviewer') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('reviewer.editor.noReviewer') }}">
                    <i class="fa fa-times-circle menu-icon"></i>
                    <span class="menu-title">No Review</span>
                    @php
                        $noReviewCount = \App\Models\AbstractModel::doesntHave('abstractReviews')
                            ->orWhereHas('abstractReviews', function ($query) {
                                $query->whereNull('comment');
                            })
                            ->count();
                    @endphp
                    <span
                        class="badge {{ $noReviewCount > 0 ? 'badge-danger' : 'badge-secondary' }}">{{ $noReviewCount }}
                    </span>
                </a>
            </li>
            <li class="nav-item {{ request()->routeIs('reviewer.editor.revision') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('reviewer.editor.revision') }}">
                    <i class="fa fa-edit menu-icon"></i>
                    <span class="menu-title">Revision Req</span>
                    @php
                        $revision = \App\Models\AbstractModel::where('status', 'revision')->count();
                    @endphp
                    <span
                        class="badge {{ $revision > 0 ? 'badge-warning' : 'badge-secondary' }}">{{ $revision }}</span>
                </a>
            </li>
            <li class="nav-item {{ request()->routeIs('reviewer.editor.noDecision') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('reviewer.editor.noDecision') }}">
                    <i class="fa fa-hourglass-half menu-icon"></i>
                    <span class="menu-title">No Decision</span>
                    @php
                        $noDecisionCount = \App\Models\AbstractModel::where('status', 'under review')
                            ->whereHas('abstractReviews', function ($query) {
                                $query->whereNotNull('comment');
                            })
                            ->count();
                    @endphp
                    <span
                        class="badge {{ $noDecisionCount > 0 ? 'badge-info' : 'badge-secondary' }}">{{ $noDecisionCount }}</span>
                </a>
            </li>
            <li class="nav-item {{ request()->routeIs('reviewer.editor.withDecision') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('reviewer.editor.withDecision') }}">
                    <i class="fa fa-check-circle menu-icon"></i>
                    <span class="menu-title">With Decision</span>
                    @php
                        $withDecisionCount = \App\Models\AbstractModel::where('status', 'accepted')->count();
                    @endphp
                    <span class="badge badge-success">{{ $withDecisionCount > 0 ? $withDecisionCount : 0 }}</span>
                </a>
            </li>
            <li class="nav-item {{ request()->routeIs('reviewer.editor.index') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('reviewer.editor.index') }}">
                    <i class="fa fa-file menu-icon"></i>
                    <span class="menu-title">All Abstract</span>
                    @php
                        $abstractCount = \App\Models\AbstractModel::count();
                    @endphp
                    <span class="badge {{ $abstractCount > 0 ? 'badge-primary' : 'badge-secondary' }}">
                        {{ $abstractCount }}
                    </span>
                </a>
            </li>
            <li class="nav-item {{ request()->routeIs('reviewer.editor.workLoad') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('reviewer.editor.workLoad') }}">
                    <i class="fa fa-tasks menu-icon"></i>
                    <span class="menu-title">Review Workload</span>
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" data-toggle="collapse" aria-expanded="false" aria-controls="tables">
                    <i class="fa fa-book menu-icon"></i>
                    <span class="menu-title">Editor: Paper</span>
                    <i class="menu-arrow"></i>
                </a>
            </li>
            <li class="nav-item {{ request()->routeIs('reviewer.editor-fullpaper.noReviewer') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('reviewer.editor-fullpaper.noReviewer') }}">
                    <i class="fa fa-times-circle menu-icon"></i>
                    <span class="menu-title">No Review</span>
                    @php
                        $noReviewCount = \App\Models\FullPaper::doesntHave('fullPaperReviews')
                            ->orWhereHas('fullPaperReviews', function ($query) {
                                $query->whereNull('comment');
                            })
                            ->count();
                    @endphp
                    <span
                        class="badge {{ $noReviewCount > 0 ? 'badge-danger' : 'badge-secondary' }}">{{ $noReviewCount }}
                    </span>
                </a>
            </li>
            <li class="nav-item {{ request()->routeIs('reviewer.editor-fullpaper.revision') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('reviewer.editor-fullpaper.revision') }}">
                    <i class="fa fa-edit menu-icon"></i>
                    <span class="menu-title">Revision Req</span>
                    @php
                        $revisionCount = \App\Models\FullPaper::where('status', 'revision')->count();
                    @endphp
                    <span
                        class="badge {{ $revisionCount > 0 ? 'badge-warning' : 'badge-secondary' }}">{{ $revisionCount }}</span>
                </a>
            </li>
            <li class="nav-item {{ request()->routeIs('reviewer.editor-fullpaper.noDecision') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('reviewer.editor-fullpaper.noDecision') }}">
                    <i class="fa fa-hourglass-half menu-icon"></i>
                    <span class="menu-title">No Decision</span>
                    @php
                        $noDecisionCount = \App\Models\FullPaper::where('status', 'under review')
                            ->whereHas('fullPaperReviews', function ($query) {
                                $query->whereNotNull('comment');
                            })
                            ->count();
                    @endphp
                    <span
                        class="badge {{ $noDecisionCount > 0 ? 'badge-info' : 'badge-secondary' }}">{{ $noDecisionCount }}</span>
                </a>
            </li>
            <li class="nav-item {{ request()->routeIs('reviewer.editor-fullpaper.withDecision') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('reviewer.editor-fullpaper.withDecision') }}">
                    <i class="fa fa-check-circle menu-icon"></i>
                    <span class="menu-title">With Decision</span>
                    @php
                        $withDecisionCount = \App\Models\FullPaper::where('status', 'accepted')->count();
                    @endphp
                    <span class="badge badge-success">{{ $withDecisionCount > 0 ? $withDecisionCount : 0 }}</span>
                </a>
            </li>
            <li class="nav-item {{ request()->routeIs('reviewer.editor-fullpaper.index') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('reviewer.editor-fullpaper.index') }}">
                    <i class="fa fa-file-alt menu-icon"></i>
                    <span class="menu-title">All Papers</span>
                    @php
                        $paperCount = \App\Models\FullPaper::count();
                    @endphp
                    <span class="badge {{ $paperCount > 0 ? 'badge-primary' : 'badge-secondary' }}">{{ $paperCount }}
                    </span>
                </a>
            </li>
            <li class="nav-item {{ request()->routeIs('reviewer.editor-fullpaper.workLoad') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('reviewer.editor-fullpaper.workLoad') }}">
                    <i class="fa fa-tasks menu-icon"></i>
                    <span class="menu-title">Review Workload</span>
                </a>
            </li>
        </ul>
    </nav>
@endrole

@role('reviewer')
    <nav class="sidebar sidebar-offcanvas" id="sidebar">
        <ul class="nav">
            <li class="nav-item {{ request()->routeIs('reviewer.summary') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('reviewer.summary') }}">
                    <i class="fa fa-clone menu-icon"></i>
                    <span class="menu-title">Summary</span>
                </a>
            </li>
            <li class="nav-item {{ request()->routeIs('reviewer.review-abstract.index') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('reviewer.review-abstract.index') }}">
                    <i class="fa fa-file-text menu-icon"></i>
                    <span class="menu-title">Review Abstract</span>
                    @php
                        $countPendingReviews = \App\Models\AbstractModel::whereHas('abstractReviews', function (
                            $query,
                        ) {
                            $query->where('reviewer_id', auth()->id());
                        })
                            ->whereIn('status', ['under review', 'revision'])
                            ->count();
                    @endphp
                    <span
                        class="badge {{ $countPendingReviews > 0 ? 'badge-danger' : 'badge-secondary' }}  ml-2">{{ $countPendingReviews }}</span>
                </a>
            </li>

            <li class="nav-item {{ request()->routeIs('reviewer.review-completed') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('reviewer.review.review-completed') }}">
                    <i class="fa fa-check-circle menu-icon"></i>
                    <span class="menu-title">Abstract Completed</span>
                    @php
                        $countCompletedReviews = \App\Models\AbstractModel::whereHas('abstractReviews', function (
                            $query,
                        ) {
                            $query->where('reviewer_id', auth()->id());
                        })
                            ->where('status', 'accepted')
                            ->count();
                    @endphp
                    <span
                        class="badge {{ $countCompletedReviews > 0 ? 'badge-success' : 'badge-secondary' }}  ml-2">{{ $countCompletedReviews }}</span>
                </a>
            </li>

            <li class="nav-item {{ request()->routeIs('reviewer.review-fullpaper.index') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('reviewer.review-fullpaper.index') }}">
                    <i class="fa fa-file-alt menu-icon"></i>
                    <span class="menu-title">Review Fullpaper</span>
                    @php
                        $countPendingPapers = \App\Models\FullPaper::whereHas('fullPaperReviews', function ($query) {
                            $query->where('reviewer_id', auth()->id());
                        })
                            ->whereIn('status', ['under review', 'revision'])
                            ->count();
                    @endphp
                    <span
                        class="badge {{ $countPendingPapers > 0 ? 'badge-danger' : 'badge-secondary' }} ml-2">{{ $countPendingPapers }}</span>
                </a>
            </li>
            <li class="nav-item {{ request()->routeIs('reviewer.review-fullpaper.review-completed') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('reviewer.review-fullpaper.review-completed') }}">
                    <i class="fa fa-check-double menu-icon"></i>
                    <span class="menu-title">Paper Completed </span>
                    @php
                        $countCompletedPapers = \App\Models\FullPaper::whereHas('fullPaperReviews', function ($query) {
                            $query->where('reviewer_id', auth()->id());
                        })
                            ->where('status', 'accepted')
                            ->count();
                    @endphp
                    <span
                        class="badge {{ $countCompletedPapers > 0 ? 'badge-success' : 'badge-secondary' }} ml-2">{{ $countCompletedPapers }}</span>
                </a>
            </li>
        </ul>
    </nav>
@endrole

@role(['presenter', 'indonesia-presenter', 'foreign-presenter'])
    <nav class="sidebar sidebar-offcanvas" id="sidebar">
        <ul class="nav">
            <li class="nav-item">
                <a class="nav-link" href="{{ route('dashboard') }}">
                    <i class="fa fa-clone menu-icon"></i>
                    <span class="menu-title">Dashboard</span>
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="{{ route('abstracts.index') }}">
                    <i class="fa fa-book menu-icon"></i>
                    <span class="menu-title">Abstract</span>
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="{{ route('filepayments.create') }}">
                    <i class="fa fa-credit-card-alt menu-icon"></i>
                    <span class="menu-title">Payment</span>
                </a>
            </li>
        </ul>
    </nav>
@endrole

@role(['participant', 'indonesia-participants', 'foreign-participants'])
    <nav class="sidebar sidebar-offcanvas" id="sidebar">
        <ul class="nav">
            <li class="nav-item">
                <a class="nav-link" href="{{ route('dashboard') }}">
                    <i class="fa fa-clone menu-icon"></i>
                    <span class="menu-title">Dashboard</span>
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="{{ route('filepayments.create') }}">
                    <i class="fa fa-credit-card-alt menu-icon"></i>
                    <span class="menu-title">Payment</span>
                </a>
            </li>
        </ul>
    </nav>
@endrole

@role('landing-editor')
    <nav class="sidebar sidebar-offcanvas" id="sidebar">
        <ul class="nav">
            <li class="nav-item {{ request()->routeIs('landing.logos.index') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('landing.logos.index') }} ">
                    <i class="fa-brands fa-slack menu-icon"></i>
                    <span class="menu-title">Logo</span>
                </a>
            </li>

            <li class="nav-item {{ request()->routeIs('landing.landingpage.index') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('landing.landingpage.index') }}">
                    <i class="fa-solid fa-house-chimney menu-icon"></i>
                    <span class="menu-title">Landing Page</span>
                </a>
            </li>

            <li class="nav-item {{ request()->routeIs('landing.themes.index') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('landing.themes.index') }}">
                    <i class="fa-solid fa-list-check menu-icon"></i>
                    <span class="menu-title">Call for Paper</span>
                </a>
            </li>
            <li class="nav-item {{ request()->routeIs('landing.committee.index') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('landing.committee.index') }}">
                    <i class="fa-solid fa-users menu-icon"></i>
                    <span class="menu-title"> Committe</span>
                </a>
            </li>

            <li class="nav-item {{ request()->routeIs('landing.submission.index') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('landing.submission.index') }}">
                    <i class="fa-brands fa-readme menu-icon"></i>
                    <span class="menu-title">Submission Guidelines</span>
                </a>
            </li>

            <li class="nav-item {{ request()->routeIs('landing.conferencelanding.index') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('landing.conferencelanding.index') }}">
                    <i class="fa-solid fa-calendar-alt menu-icon"></i>
                    <span class="menu-title">Conference Program</span>
                </a>
            </li>

            <li class="nav-item {{ request()->routeIs('landing.prevconference.index') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('landing.prevconference.index') }}">
                    <i class="fa-solid fa-calendar-check menu-icon"></i>
                    <span class="menu-title">Previous Conference</span>
                </a>
            </li>

            <li class="nav-item {{ request()->routeIs('landing.gallery.index') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('landing.gallery.index') }}">
                    <i class="fa-solid fa-images menu-icon"></i>
                    <span class="menu-title">Gallery</span>
                </a>
            </li>

            <li class="nav-item {{ request()->routeIs('landing.payment_guidelines.index') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('landing.payment_guidelines.index') }}">
                    <i class="fa-solid fa-money-check-dollar menu-icon"></i>
                    <span class="menu-title">Payment Guidelines</span>
                </a>
            </li>
            <li class="nav-item {{ request()->routeIs('landing.faq.index') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('landing.faq.index') }}">
                    <i class="fa-solid fa-question menu-icon"></i>
                    <span class="menu-title">FAQ</span>
                </a>
            </li>

            <li class="nav-item {{ request()->routeIs('landing.hotels.index') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('landing.hotels.index') }}">
                    <i class="fa-solid fa-bed menu-icon"></i>
                    <span class="menu-title">Hotel & Accom.</span>
                </a>
            </li>

            <li class="nav-item {{ request()->routeIs('landing.whatsapp.index') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('landing.whatsapp.index') }}">
                    <i class="fa-solid fa-envelope menu-icon"></i>
                    <span class="menu-title">Whatsapp</span>
                </a>
            </li>

            <li class="nav-item {{ request()->routeIs('landing.instagram.index') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('landing.instagram.index') }}">
                    <i class="fa-brands fa-instagram menu-icon"></i>
                    <span class="menu-title">Instagram</span>
                </a>
            </li>

            <li class="nav-item {{ request()->routeIs('landing.newsletters.index') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('landing.newsletters.index') }}">
                    <i class="fa-solid fa-envelope-open-text menu-icon"></i>
                    <span class="menu-title">Newsletter</span>
                </a>
            </li>
            <li class="nav-item {{ request()->routeIs('landing.setting.index') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('landing.setting.index') }}">
                    <i class="fa-solid fa-gears menu-icon"></i>
                    <span class="menu-title">Setting</span>
                </a>
            </li>

        </ul>
    </nav>
@endrole
