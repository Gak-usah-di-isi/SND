@extends('layouts.app')

@section('title', 'Conference Settings')

@section('content')
    <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
            <div class="card-body">
                <h4 class="card-title">Conference Settings</h4>

                @if (session('success'))
                    <div class="alert alert-success">{{ session('success') }}</div>
                @endif

                <form action="{{ route('admin.settings.update') }}" method="POST">
                    @csrf

                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label">Conference Title</label>
                                <input type="text" name="conference_title" class="form-control"
                                    placeholder="The 4rd International Conference on Applied Science for Vocational"
                                    value="{{ old('conference_title', $settings->conference_title ?? '') }}">
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label">Conference Abbreviation</label>
                                <input type="text" name="conference_abbreviation" class="form-control"
                                    placeholder="ICASVE 2025"
                                    value="{{ old('conference_abbreviation', $settings->conference_abbreviation ?? '') }}">
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label">Conference Chairperson</label>
                                <input type="text" name="conference_chairperson" class="form-control"
                                    placeholder="Dr. A. Faidlal Rahman, SE.Par., M.Sc., CHE."
                                    value="{{ old('conference_chairperson', $settings->conference_chairperson ?? '') }}">
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label">Administrator Email</label>
                                <input type="text" name="administrator_email" class="form-control"
                                    placeholder="icasve@ub.ac.id,salnan@ub.ac.id,cahyawuri@ub.ac.id"
                                    value="{{ old('administrator_email', $settings->administrator_email ?? '') }}">
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label">Treasurer Email</label>
                                <input type="text" name="treasurer_email" class="form-control"
                                    placeholder="icasve@ub.ac.id,salnan@ub.ac.id,cahyawuri@ub.ac.id"
                                    value="{{ old('treasurer_email', $settings->treasurer_email ?? '') }}">
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label">Bank Account</label>
                                <input type="text" name="bank_account" class="form-control"
                                    placeholder="VA Mandiri ICASVE : 891187776, VA ICASVE BNI : 0516377760000"
                                    value="{{ old('bank_account', $settings->bank_account ?? '') }}">
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label">Max Abstracts Per Participant</label>
                                <input type="number" name="max_abstracts_per_participant" class="form-control"
                                    min="0" placeholder="1"
                                    value="{{ old('max_abstracts_per_participant', $settings->max_abstracts_per_participant ?? '') }}">
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label">Max Words in Abstract Body</label>
                                <input type="number" name="max_words_in_abstract_body" class="form-control" min="0"
                                    placeholder="250"
                                    value="{{ old('max_words_in_abstract_body', $settings->max_words_in_abstract_body ?? '') }}">
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label">Attendance Format</label>
                                <select name="attendance_format" class="form-select">
                                    <option value="onsite"
                                        {{ old('attendance_format', $settings->attendance_format ?? '') == 'onsite' ? 'selected' : '' }}>
                                        Onsite</option>
                                    <option value="online"
                                        {{ old('attendance_format', $settings->attendance_format ?? '') == 'online' ? 'selected' : '' }}>
                                        Online</option>
                                    <option value="hybrid"
                                        {{ old('attendance_format', $settings->attendance_format ?? '') == 'hybrid' ? 'selected' : '' }}>
                                        Hybrid</option>
                                </select>
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div class="form-check form-switch mt-4">
                                <input class="form-check-input" type="checkbox" name="open_registration" value="1"
                                    {{ old('open_registration', $settings->open_registration ?? false) ? 'checked' : '' }}>
                                <label class="form-check-label">Open Registration</label>
                            </div>

                            <div class="form-check form-switch mt-2">
                                <input class="form-check-input" type="checkbox" name="open_full_paper_upload" value="1"
                                    {{ old('open_full_paper_upload', $settings->open_full_paper_upload ?? false) ? 'checked' : '' }}>
                                <label class="form-check-label">Open Full Paper Upload</label>
                            </div>

                            <div class="form-check form-switch mt-2">
                                <input class="form-check-input" type="checkbox" name="open_abstract_submission"
                                    value="1"
                                    {{ old('open_abstract_submission', $settings->open_abstract_submission ?? false) ? 'checked' : '' }}>
                                <label class="form-check-label">Open Abstract Submission</label>
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label">Payment Insruction</label>
                                <textarea name="payment_instruction" class="form-control @error('payment_instruction') is-invalid @enderror"
                                    placeholder="Payment instruction" rows="5">{{ old('payment_instruction', $settings->payment_instruction ?? '') }}</textarea>
                                @error('payment_instruction')
                                    <div class="text-danger">{{ $message }}</div>
                                @enderror
                            </div>
                        </div>

                        <div class="col-12 mt-3">
                            <button type="submit" class="btn btn-primary">Save Settings</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
@endsection
