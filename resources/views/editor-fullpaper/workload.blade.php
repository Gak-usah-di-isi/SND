@extends('layouts.app')

@section('title', 'Workload Full Paper')

@section('content')
    <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
            <div class="card-body">
                <h4 class="card-title">Workload Full Paper</h4>
                <div class="table-responsive">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Reviewer</th>
                                <th>In Review</th>
                                <th>Completed</th>
                                <th>Assigned</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($workloads as $workload)
                                <tr>
                                    <td>{{ $workload['name'] }}</td>
                                    <td>{{ $workload['in_review'] }}</td>
                                    <td>{{ $workload['completed'] }}</td>
                                    <td>{{ $workload['assigned'] }}</td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
@endsection
