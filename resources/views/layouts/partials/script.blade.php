<script src="{{ asset('vendors/js/vendor.bundle.base.js') }}"></script>
<script src="{{ asset('vendors/datatables.net/jquery.dataTables.js') }}"></script>
<script src="{{ asset('vendors/datatables.net-bs4/dataTables.bootstrap4.js') }}"></script>
<script src="{{ asset('js/template.js') }}"></script>
<script src="{{ asset('js/dashboard.js') }}"></script>
<!--Production-->
{{-- <script type="module" src="{{ asset('build/' . ltrim($manifest['resources/js/app.js']['file'], '/')) }}"></script> --}}
@vite(['resources/js/app.js'])
<script>
    document.addEventListener("DOMContentLoaded", function() {
        if (window.Swal && "{{ session('type') }}" && "{{ session('message') }}") {
            Swal.fire({
                icon: "{{ session('type') }}",
                title: "{{ session('type') }}" === "success" ? "Success!" : "{{ session('type') }}" ===
                    "error" ? "Error!" : "{{ session('type') }}" ===
                    "warning" ? "Warning!" : "Info",
                text: "{{ session('message') }}",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "OK"
            });
        }
    });


    document.addEventListener("DOMContentLoaded", function() {
        document.querySelectorAll(".btn-delete").forEach(button => {
            button.addEventListener("click", function(e) {
                e.preventDefault();
                let form = this.closest("form");

                Swal.fire({
                    title: "Are you sure?",
                    text: "This data will be permanently deleted!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#d33",
                    cancelButtonColor: "#3085d6",
                    confirmButtonText: "Yes, delete it!"
                }).then((result) => {
                    if (result.isConfirmed) {
                        form.submit();
                    }
                });
            });
        });
    });
</script>
