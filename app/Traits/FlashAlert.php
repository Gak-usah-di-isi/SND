<?php

namespace App\Traits;

/**
 * Flash Alert Notification
 */
trait FlashAlert
{
    public function alertCreated()
    {
        return [
            'type' => 'success',
            'message' => 'Data successfully created!'
        ];
    }

    public function alertUpdated()
    {
        return [
            'type' => 'success',
            'message' => 'Data successfully updated!'
        ];
    }

    public function alertDeleted()
    {
        return [
            'type' => 'success',
            'message' => 'Data successfully deleted!'
        ];
    }

    public function alertNotFound()
    {
        return [
            'type' => 'warning',
            'message' => 'Data not found!'
        ];
    }

    public function alertDanger()
    {
        return [
            'type' => 'error',
            'message' => 'Something wrong!'
        ];
    }

    public function permissionDenied()
    {
        return [
            'type' => 'error',
            'message' => 'you don’t have permission to access!'
        ];
    }

    public function alertAssign()
    {
        return [
            'type' => 'success',
            'message' => 'Data successfully assigned!'
        ];
    }

    public function alertReview()
    {
        return [
            'type' => 'success',
            'message' => 'Review successfully submitted!'
        ];
    }

    public function alertAbstractClosed()
    {
        return [
            'type' => 'success',
            'message' => 'Abstract Submission Closed!'
        ];
    }

    public function alertFullpaperClosed()
    {
        return [
            'type' => 'success',
            'message' => 'Fullpaper Submission Closed!'
        ];
    }
    public function alertAbstractNotEdit()
    {
        return [
            'type' => 'warning',
            'message' => 'Cannot edit abstract in review process!'
        ];
    }

    public function alertAbstractNotDelete()
    {
        return [
            'type' => 'warning',
            'message' => 'Cannot delete abstract in review process!'
        ];
    }

    public function alertFullpaperNotEdit()
    {
        return [
            'type' => 'warning',
            'message' => 'Cannot edit Fullpaper in review process!'
        ];
    }

    public function alertArchivedYear()
    {
        return [
            'type' => 'warning',
            'message' => 'This record belongs to a previous conference year and can no longer be edited or deleted.'
        ];
    }

    public function alertAbstractLimit($message)
    {
        return [
            'type' => 'error',
            'message' => $message,
        ];
    }
}
