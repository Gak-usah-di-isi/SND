<table style="width:100%; border-collapse:collapse; margin-top:20px; font-size:11pt;">
    <tr style="background:#e6f0fa; font-weight:bold;">
        <td style="border:1px solid #333; padding:4px;">Time***</td>
        <td style="border:1px solid #333; padding:4px;">Program</td>
        <td style="border:1px solid #333; padding:4px;">PIC</td>
    </tr>
    @foreach ($items as $item)
        @if ($item->is_section_header)
            <tr style="background:#e6f0fa; font-weight:bold;">
                <td colspan="3" style="border:1px solid #333; padding:4px; text-align:center;">
                    {!! nl2br(e($item->program)) !!}
                </td>
            </tr>
        @else
            <tr>
                <td style="border:1px solid #333; padding:4px;">{!! nl2br(e($item->time_label)) !!}</td>
                <td style="border:1px solid #333; padding:4px;">{!! nl2br(e($item->program)) !!}</td>
                <td style="border:1px solid #333; padding:4px;">{!! nl2br(e($item->pic)) !!}</td>
            </tr>
        @endif
    @endforeach
    <tr>
        <td colspan="3" style="border:1px solid #333; padding:4px; font-size:10px;">
            *** Refer to Indonesian Western Time (WIB)
        </td>
    </tr>
</table>
