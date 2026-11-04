@extends('layouts.app')

@section('title', 'Call for Paper')

@section('content')
    <div class="container card p-4">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h4 class="card-title mb-0">Call for Paper</h4>
                            <a href="{{ route('landing.themes.create') }}" class="btn btn-success btn-md rounded-sm">
                                <i class="fas fa-plus"></i> Add New Theme
                            </a>
                        </div>

                        <form method="GET" action="{{ route('landing.themes.index') }}" class="mb-3">
                            <div class="row g-2">
                                <div class="col-md-2">
                                    <select name="year" class="form-select w-fit" onchange="this.form.submit()">
                                        <option value="">Select Year</option>
                                        @foreach ($years as $year)
                                            <option value="{{ $year }}" {{ request('year') == $year ? 'selected' : '' }}>
                                                {{ $year }}
                                            </option>
                                        @endforeach
                                    </select>
                                </div>
                            </div>
                        </form>

                        <div class="table-responsive">
                            <table class="table table-hover table-bordered">
                                <thead class="table-dark text-center">
                                    <tr>
                                        <th style="width: 5%;">No</th>
                                        <th style="width: 30%;">Theme</th>
                                        <th style="width: 35%;">Description</th>
                                        <th style="width: 10%;">Year</th>
                                        <th style="width: 20%;">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @forelse ($themes as $theme)
                                        <tr class="text-center">
                                            <td>{{ $loop->iteration }}</td>
                                            <td class="text-start">{{ $theme->title }}</td>
                                            <td>{{ \Illuminate\Support\Str::limit(html_entity_decode(strip_tags($theme->description)), 100, '...') }}</td>

                                            <td>{{ $theme->year }}</td>
                                            <td>
                                                <a href="{{ route('landing.themes.edit', $theme->id) }}" class="btn btn-warning btn-sm">
                                                    <i class="fas fa-edit"></i> Edit
                                                </a>
                                                <form action="{{ route('landing.themes.destroy', $theme->id) }}" method="POST"
                                                    class="d-inline" onsubmit="return confirm('Are you sure?');">
                                                    @csrf
                                                    @method('DELETE')
                                                    <button type="submit" class="btn btn-danger btn-sm">
                                                        <i class="fas fa-trash"></i> Delete
                                                    </button>
                                                </form>
                                            </td>
                                        </tr>
                                    @empty
                                        <tr>
                                            <td colspan="5" class="text-center text-muted">No themes available.</td>
                                        </tr>
                                    @endforelse
                                </tbody>
                            </table>
                        </div>

                        <div class="mt-3">
                            {{ $themes->links() }}
                        </div>
    </div>
@endsection
