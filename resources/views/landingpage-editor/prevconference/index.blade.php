@extends('layouts.app') @section('title', 'Previous Conference') @section('content') <div
    class="col-lg-12 grid-margin stretch-card">
    <div class="card">
        <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
                <h4 class="card-title">Previous Conferences</h4> <a href="{{ route('landing.prevconference.create') }}"
                    class="btn btn-sm btn-success">New Previous Conference</a>
            </div>
            <p class="card-description"> List of previous conferences </p>
            <div class="table-responsive pt-3">
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>PDF</th>
                            <th>Year</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($prevconferences as $prevconference)
                            <tr>
                                <td>{{ $loop->iteration }}</td>
                                <td>{{ $prevconference->title }}</td>
                                <td>{{ $prevconference->description }}</td>
                                <td>
                                    @if ($prevconference->pdf)
                                        <a href="{{ $prevconference->pdf }}" target="_blank">Download PDF</a>
                                    @else
                                        No PDF
                                    @endif
                                </td>
                                <td>{{ $prevconference->date }}</td>
                                <td>
                                    <a href="{{ route('landing.prevconference.edit', $prevconference->id) }}"
                                        class="btn btn-sm btn-warning">Edit</a>
                                    <form action="{{ route('landing.prevconference.destroy', $prevconference->id) }}"
                                        method="POST" style="display: inline-block;">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="btn btn-sm btn-danger"
                                            onclick="return confirm('Are you sure?')">Delete</button>
                                    </form>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div> @endsection
