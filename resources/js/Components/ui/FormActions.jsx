export default function FormActions({
	id,
	onCancel,
	onSubmit,
	cancelText = 'Cancel',
	submitText = 'Save',
}) {
	return (
		<div className="sticky bottom-6 z-10" style={{ width: '100%' }}>
			<div
				className="flex items-center gap-2"
				style={{
					'--Paper-shadow': '0px 0px 20px rgba(0, 0, 0, 0.1)',
					borderRadius: 12,
					padding: '16px',
					boxShadow: 'var(--Paper-shadow)',
					backgroundColor: '#FFFFFF',
					width: '100%',
				}}
			>
				<div className="flex items-center gap-2">
				{onCancel && (
					<button
						id={id ? `${id}-cancel-button` : undefined}
						type="button"
						onClick={onCancel}
						className="h-[36px] inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 px-5 py-2.5 text-sm gap-2 rounded-md cursor-pointer"
						style={{
							backgroundColor: 'rgba(1,82,234,0.1)',
							color: '#0152EA',
							border: 'none',
						}}
						onMouseEnter={(event) => { event.currentTarget.style.backgroundColor = 'rgba(1,82,234,0.2)'; }}
						onMouseLeave={(event) => { event.currentTarget.style.backgroundColor = 'rgba(1,82,234,0.1)'; }}
					>
						{cancelText}
					</button>
				)}
				<button
					id={id ? `${id}-submit-button` : undefined}
					type="submit"
					onClick={onSubmit}
					className="h-[36px] inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 px-5 py-2.5 text-sm gap-2 text-white rounded-md cursor-pointer"
					style={{ backgroundColor: '#0152EA' }}
					onMouseEnter={(event) => { event.currentTarget.style.backgroundColor = '#0141C8'; }}
					onMouseLeave={(event) => { event.currentTarget.style.backgroundColor = '#0152EA'; }}
				>
					{submitText}
				</button>
				</div>
			</div>
		</div>
	);
}
