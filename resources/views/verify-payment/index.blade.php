@extends('layouts.app')

@section('title', 'Payment Verification')

@section('content')
    <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
            <div class="card-body">
                <h4 class="card-title">Table of Payment</h4>

                <div class="table-responsive pt-3">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Nomor</th>
                                <th>Name / Institution / Email</th>
                                <th>Registration Type</th>
                                <th>Proof</th>
                                <th>Receipt</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($payments as $key => $payment)
                                <tr>
                                    <td>{{ $payments->firstItem() + $key }}</td>
                                    <td>
                                        <strong>{{ $payment->user->name }}</strong><br>
                                        {{ $payment->user->institution }}<br>
                                        {{ $payment->user->email }}
                                    </td>
                                    <td>
                                        {{ $payment->user->roles->first()->name }}
                                    </td>
                                    <td class="text-center">
                                        @if ($payment->file_path)
                                            <a href="{{ asset('storage/' . $payment->file_path) }}" target="_blank"
                                                class="btn btn-light btn-sm" data-bs-toggle="tooltip"><i
                                                    class="fa fa-file fa-lg"></i></a>
                                        @else
                                            No proof available
                                        @endif
                                    </td>
                                    <td class="text-center">
                                        <a href="{{ route('admin.payment.digitalPdf', $payment->id) }}" target="_blank"
                                            class="btn btn-light btn-sm" data-bs-toggle="tooltip" title="Open Digital PDF">
                                            <i class="fa fa-file-pdf text-danger fa-lg"></i>
                                        </a>
                                    </td>
                                    <td>
                                        @if ($payment->currency == 'USD')
                                            $ {{ $payment->amount }}
                                        @else
                                            Rp {{ number_format($payment->amount, 0, ',', '.') }}
                                        @endif
                                    </td>
                                    <td>
                                        <span
                                            class="badge {{ $payment->status == 'verified' ? 'bg-success' : 'bg-warning' }}">
                                            {{ ucfirst($payment->status) }}
                                        </span>
                                    </td>
                                    <td>
                                        <form action="{{ route('admin.payment.verify', $payment->id) }}" method="POST">
                                            @csrf
                                            @method('PUT')
                                            <button type="submit"
                                                class="btn btn-sm {{ $payment->status == 'verified' ? 'btn-warning' : 'btn-success' }}">
                                                @if ($payment->status == 'verified')
                                                    <i class="fa fa-undo"></i> Revert to Pending
                                                @else
                                                    <i class="fa fa-check"></i> Verify Payment
                                                @endif
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
                <nav aria-label="Page navigation">
                    <ul class="pagination justify-content-center">
                        <li class="page-item {{ $payments->onFirstPage() ? 'disabled' : '' }}">
                            <a class="page-link" href="{{ $payments->previousPageUrl() }}" aria-label="Previous">
                                <span aria-hidden="true">&laquo;</span>
                            </a>
                        </li>
                        @foreach ($payments->getUrlRange(1, $payments->lastPage()) as $page => $url)
                            <li class="page-item {{ $page == $payments->currentPage() ? 'active' : '' }}">
                                <a class="page-link" href="{{ $url }}">{{ $page }}</a>
                            </li>
                        @endforeach
                        <li class="page-item {{ $payments->hasMorePages() ? '' : 'disabled' }}">
                            <a class="page-link" href="{{ $payments->nextPageUrl() }}" aria-label="Next">
                                <span aria-hidden="true">&raquo;</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    </div>
@endsection
