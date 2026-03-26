import { router } from '@inertiajs/react'
import { useState } from 'react'

export default function RankingHome() {

    const [file, setFile] = useState<File | null>(null)

    const submit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!file) return

        const formData = new FormData()
        formData.append('file', file)

        router.post('/import-institutional', formData)
    }

    return (
        <div className="p-6">
            <h2 className="text-xl mb-4">Импорт институционального рейтинга</h2>

            <form onSubmit={submit}>
                <input
                    type="file"
                    onChange={(e) =>
                        setFile(e.target.files ? e.target.files[0] : null)
                    }
                />

                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 ml-2"
                >
                    Импорт
                </button>
            </form>
        </div>
    )
}