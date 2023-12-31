<script lang="ts">
	import {
		send_new_user_email_code_schema,
		update_user_email_schema,
		type SendNewUserEmailCode,
		type UpdateUserEmailSchema
	} from '$lib/schemas';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';
	import { focusTrap, Step, Stepper } from '@skeletonlabs/skeleton';
	import LoadingIcon from '$lib/components/LoadingIcon.svelte';
	import TextInput from './inputs/TextInput.svelte';
	import EmailInput from './inputs/EmailInput.svelte';
	import { goto, invalidateAll } from '$app/navigation';
	import type { StepperState } from '@skeletonlabs/skeleton/dist/components/Stepper/types';
	import type { Writable } from 'svelte/store';
	import Button from '$lib/components/Button.svelte';

	export let form_data: SuperValidated<UpdateUserEmailSchema>;
	export let send_new_user_email_code_form_data: SuperValidated<SendNewUserEmailCode>;
	let completeState: Writable<StepperState>;
	$: successfullySentCode = false;
	$: lock_verify_code = !successfullySentCode;

	const { form, errors, constraints, enhance, delayed } = superForm(form_data, {
		id: 'updateUserEmailForm',
		applyAction: true,
		invalidateAll: true,
		resetForm: false,
		validators: update_user_email_schema,
		delayMs: 0,
		timeoutMs: 8000,
		onResult(event) {
			const { result, formEl, cancel } = event;
			if (result.type == 'success') {
				invalidateAll();
				$completeState.current = 0;
			}
			return;
		}
	});
	let isFocused: boolean = false;

	const {
		form: SendNewUserEmailCodeForm,
		errors: SendNewUserEmailCodeErrors,
		constraints: SendNewUserEmailCodeConstraints,
		enhance: SendNewUserEmailCodeEnhance,
		delayed: SendNewUserEmailCodeDelayed
	} = superForm(send_new_user_email_code_form_data, {
		id: 'sendUserEmailCode',
		applyAction: true,
		invalidateAll: true,
		resetForm: true,
		validators: send_new_user_email_code_schema,
		delayMs: 0,
		timeoutMs: 8000,
		onResult(event) {
			const { result, formEl, cancel } = event;
			if (result.type == 'success') {
				form.set({ email: result.data?.form.data.email, code: '' });
				successfullySentCode = true;
			} else {
				successfullySentCode = false;
			}

			return;
		}
	});
	let isSendEmailFocused: boolean = false;
</script>

<div class="card">
	<header class="card-header flex justify-center">
		<h1>Change Your Email</h1>
	</header>
	<section class="p-4">
		<Stepper>
			<Step bind:locked={lock_verify_code}>
				<svelte:fragment slot="header">Enter Your New Email</svelte:fragment>
				<form
					id="sendUserEmailCode"
					use:focusTrap={isSendEmailFocused}
					method="POST"
					action="/settings/?/sendUserEmailCode"
					use:SendNewUserEmailCodeEnhance
					class="flex flex-row"
				>
					<EmailInput
						name="email"
						label="email"
						bind:value={$SendNewUserEmailCodeForm.email}
						errors={$SendNewUserEmailCodeErrors.email}
						constraints={$SendNewUserEmailCodeConstraints.email}
					/>

					{#if $SendNewUserEmailCodeDelayed}
						<div class="flex items-center justify-center mt-6">
							<LoadingIcon />
						</div>
					{:else}
						<Button
							shadow="shadow-md"
							color="variant-filled-primary"
							form="sendUserEmailCode"
							type="submit"
							class="btn mt-7">Send Code</Button
						>
					{/if}
				</form>
				<svelte:fragment slot="navigation">
					<br />
				</svelte:fragment>
			</Step>
			<form
				id="updateUserEmail"
				use:focusTrap={isFocused}
				method="POST"
				action="/settings/?/updateUserEmail"
				use:enhance
			>
				<Step
					bind:state={completeState}
					buttonCompleteLabel="Update Email"
					buttonCompleteType="submit"
				>
					<svelte:fragment slot="header">Submit Your Code</svelte:fragment>
					<input hidden={true} name="email" bind:value={$form.email} />
					<div class="relative flex space-x-4 flex-row h-full">
						<TextInput
							name="code"
							label="code"
							bind:value={$form.code}
							errors={$errors.code}
							constraints={$constraints.code}
						/>

						<div class="flex items-center justify-center">
							{#if $delayed}
								<div class="flex items-center justify-center mt-6">
									<LoadingIcon />
								</div>
							{/if}
						</div>
					</div>
				</Step>
			</form>
		</Stepper>
	</section>
</div>
