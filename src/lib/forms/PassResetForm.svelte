<script lang="ts">
	import { reset_pass_schema, type ResetPassSchema } from '$lib/schemas';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';
	export let form_data: SuperValidated<ResetPassSchema>;
	import { focusTrap } from '@skeletonlabs/skeleton';
	import PasswordInput from './inputs/PasswordInput.svelte';
	import Link from '$lib/components/Link.svelte';
	import Button from '$lib/components/Button.svelte';

	const { form, errors, constraints, enhance } = superForm(form_data, {
		applyAction: true,
		invalidateAll: true,
		resetForm: false,
		validators: reset_pass_schema
	});
	let isFocused: boolean = true;
</script>

<div class="card">
	<header class="card-header flex justify-center">
		<h1>Reset Password</h1>
	</header>
	<section class="p-4">
		<form id="reset" use:focusTrap={isFocused} method="POST" action="?/reset" use:enhance>
			<PasswordInput
				name="password"
				label="Password"
				bind:value={$form.password}
				errors={$errors.password}
				constraints={$constraints.password}
			/>
			<PasswordInput
				name="val_password"
				label="Password"
				bind:value={$form.val_password}
				errors={$errors.val_password}
				constraints={$constraints.val_password}
			/>
		</form>
	</section>
	<footer class="w-full card-footer flex items-end align-middle justify-end gap-2">
		<Button shadow="shadow-md" color="variant-filled-primary" form="reset" type="submit" class="btn"
			>Submit</Button
		>
		<Link label={"Need a New Password Reset Link"} shadow="shadow-md" color="variant-soft-secondary" href="/password-reset"
			>Need a New Password Reset Link?</Link
		>
	</footer>
</div>
