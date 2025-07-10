import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

function DeleteDialog({ onDelete }: { onDelete: () => void }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="destructive">Delete</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you sure?</DialogTitle>
                </DialogHeader>
                <p>This action cannot be undone. It will permanently delete this crop.</p>
                <DialogFooter>
                    <Button variant="ghost">Cancel</Button>
                    <Button variant="destructive" onClick={onDelete}>Delete</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
export default DeleteDialog