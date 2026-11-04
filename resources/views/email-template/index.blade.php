@extends('layouts.app')

@section('title', 'Email Template')

@section('content')
    <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
            <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <h4 class="mb-0">Email Template</h4>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th class="text-center">Email Template</th>
                                <th class="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="text-center">Email Template Abstract Accepted</td>
                                <td class="text-center">
                                    <a href="{{ route('admin.email-template.edit', ['type' => 'abstract_accepted']) }}"
                                        class="btn btn-sm btn-primary">
                                        <i class="fas fa-edit"></i> Edit
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <td class="text-center">Email Template Full Paper Accepted</td>
                                <td class="text-center">
                                    <a href="{{ route('admin.email-template.edit', ['type' => 'fullpaper_accepted']) }}"
                                        class="btn btn-sm btn-primary">
                                        <i class="fas fa-edit"></i> Edit
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <td class="text-center">Email Template Abstract Invoice IDR</td>
                                <td class="text-center">
                                    <a href="{{ route('admin.email-template.edit', ['type' => 'abstract_invoice_idr']) }}"
                                        class="btn btn-sm btn-primary">
                                        <i class="fas fa-edit"></i> Edit
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <td class="text-center">Email Template Abstract Invoice USD</td>
                                <td class="text-center">
                                    <a href="{{ route('admin.email-template.edit', ['type' => 'abstract_invoice_usd']) }}"
                                        class="btn btn-sm btn-primary">
                                        <i class="fas fa-edit"></i> Edit
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
@endsection
