import { createFileRoute } from '@tanstack/react-router'
import PageFeature from '../components/PageFeature'
import { GiCrossedSwords } from 'react-icons/gi'
import { AiTwotoneTrophy } from 'react-icons/ai'
import { GoPeople } from 'react-icons/go'
import { FaRegCalendar } from 'react-icons/fa'

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {
  const pages = [
    { name: 'Tournaments', path: '', icon: <AiTwotoneTrophy /> },
    { name: 'Players', path: '', icon: <GoPeople /> },
    { name: 'Head to Head', path: '', icon: <GiCrossedSwords />},
    { name: 'Results Archive', path: '', icon:  <FaRegCalendar />}
  ]

  return (
    <div className="h-full grow flex flex-col items-center justify-evenly w-3/4 py-12 mx-auto">
      <div className="flex flex-col gap-2">
        <div className="text-3xl font-bold text-center">Welcome to TennisHistory!</div>
        <div className="text-lg text-center text-slate-400">This is a simple app to view data about men's singles in the Open Era.</div>
      </div>
      <div className="flex justify-evenly gap-10">
        { pages.map(page => (
          <PageFeature key={page.name} title={page.name} link={page.path} icon={page.icon} />
        ))}
      </div>
    </div>
  )
}
