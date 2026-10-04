import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Member } from '../types/member';

function Avatar({ member }: { member: Member }) {
  if (member.avatar) {
    return (
      <img
        src={member.avatar}
        alt={`${member.name}的头像`}
        loading="lazy"
        className="h-16 w-16 rounded-full object-cover"
      />
    );
  }
  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/30 to-purple-600/30 text-2xl font-black text-white">
      {member.name.slice(0, 1)}
    </div>
  );
}

export default function MemberCard({
  member,
  index = 0,
}: {
  member: Member;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.06 }}
    >
      <Link
        to={`/member/${member.uid}`}
        className="group block h-full rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-400/30 hover:shadow-[0_0_40px_rgba(0,240,255,0.12)] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
      >
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-gradient-to-r from-blue-400 to-purple-500 p-[2px] transition-shadow duration-300 group-hover:shadow-[0_0_18px_rgba(0,240,255,0.5)]">
            <div className="rounded-full bg-midnight p-[2px]">
              <Avatar member={member} />
            </div>
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-lg font-bold tracking-tight text-white">
              {member.name}
            </h3>
            <p className="truncate text-sm text-gray-400">{member.role}</p>
          </div>
          <span className="ml-auto shrink-0 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-semibold text-gray-300">
            {member.batch}届
          </span>
        </div>

        {member.bio && (
          <p className="mt-4 line-clamp-2 text-sm font-light leading-relaxed text-gray-400">
            {member.bio}
          </p>
        )}

        {member.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {member.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-gray-300"
              >
                {tag}
              </span>
            ))}
            {member.tags.length > 3 && (
              <span className="rounded-full px-1 py-1 text-xs text-gray-500">
                +{member.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </Link>
    </motion.div>
  );
}
