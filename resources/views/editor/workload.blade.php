@extends('layouts.app')

@section('title', 'Workload Reviewer')

@section('content')
    <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
            <div class="card-body">
                <h4 class="card-title">Workload Abstract Reviewer</h4>
                <div class="table-responsive">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>Nama</th>
                                <th>In Review</th>
                                <th>Completed</th>
                                <th>Assigned</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($workloads as $workload)
                                <tr>
                                    <td>{{ $workload['name'] }}</td>
                                    <td class="text-danger">{{ $workload['in_review'] }}</td>
                                    <td class="text-success">{{ $workload['completed'] }}</td>
                                    <td class="text-info">{{ $workload['assigned'] }}</td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
@endsection
