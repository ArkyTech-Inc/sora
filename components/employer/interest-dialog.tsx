'use client'

import { ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { Candidate } from '@/lib/employer-data'

type InterestDialogProps = {
  candidate: Candidate | null
  onOpenChange: (open: boolean) => void
  onConfirm: (candidate: Candidate) => void
}

export function InterestDialog({
  candidate,
  onOpenChange,
  onConfirm,
}: InterestDialogProps) {
  return (
    <Dialog open={candidate !== null} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {candidate && (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-xl">
                Express interest in {candidate.code}?
              </DialogTitle>
              <DialogDescription>
                You are about to request contact details for a verified{' '}
                {candidate.public.headline} based in {candidate.public.state}.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-3 rounded-lg bg-muted p-4">
              <p className="flex items-start gap-2 text-sm text-foreground">
                <ShieldCheck
                  className="mt-0.5 h-4 w-4 shrink-0 text-green"
                  aria-hidden="true"
                />
                <span>
                  The candidate is notified that{' '}
                  <strong>Nigerian Communications Commission</strong> viewed
                  their profile, and their name and contact details are shared
                  with you for recruitment purposes only.
                </span>
              </p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Under the Discrimination Against Persons with Disabilities
                (Prohibition) Act, disability information may not be used to
                exclude a candidate from consideration.
              </p>
            </div>

            <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                size="lg"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                size="lg"
                className="bg-orange font-semibold text-orange-foreground hover:bg-orange/90"
                onClick={() => onConfirm(candidate)}
              >
                Confirm &amp; unlock contact
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
