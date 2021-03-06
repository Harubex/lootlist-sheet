import { findSheet, cached, cacheKeys } from "./util";

// Max size of raid, accounting for swaps.
const raidSize = 75;
// Size of bench, awkward hard-coded value because I'm lazy.
const benchSize = 10;
// The n-th most recent raids to consider for attendance.
const attendanceHistory = 16;
// The max number of excused absences allowed.
const excusedAbsences = 1;

/**
 * Compiles attendance for each raid participant.
 * @return Raid attendance, expressed as an array of objects for each member.
 * @customfunction
 */
export default function getAttendance(): PlayerAttendance[] {
    return cached<PlayerAttendance[]>(cacheKeys.attendance, () => {
        // Get the attendance sheet.
        const attendanceSheet = findSheet("Overall Attendance");
        // Get most recent attendance data, use it to determine the number of raids logged.
        const allValues = attendanceSheet.getRange(1, 1, 100, attendanceHistory).getValues();
        const totalRaids = allValues[0].length;

        // Get the names of everyone who actively attended those raids.
        const allAttendance = attendanceSheet.getRange(1, 1, raidSize, totalRaids);
        // Get the names of everyone who actively attended those raids via the bench.
        const allBenched = attendanceSheet.getRange(80, 1, benchSize, totalRaids);

        // Merge raid/bench members together.
        const attendeeData = allAttendance.getValues().concat(allBenched.getValues());

        // If there's more raids than we care about, set a cutoff to start from.
        // This has the side-effect of culling names that haven't shown up in a long time, which is desirable for now.
        let cutoff = 0;
        if (totalRaids > attendanceHistory) {
            cutoff = totalRaids - attendanceHistory;
        }

        // Map names with the number of raids they got credit for.
        const attendanceCount: { totalRaids?: number } = {};
        const attendanceDateMap: { [name: string]: string[] } = {};
        const attendanceDates = attendeeData[0];
        for (let i = 1; i < attendeeData.length; i++) {
            for (let j = cutoff; j < attendeeData[i].length; j++) {
                const name = attendeeData[i][j];
                if (name && name.trim()) {
                    attendanceCount[name] = 1 + (attendanceCount[name] || 0);
                }
                attendanceDateMap[name] = (attendanceDateMap[name] || []).concat(attendanceDates[j]);
            }
        }

        // If the history isn't long enough, give everyone credit for the remaining raids needed.
        if (totalRaids < attendanceHistory) {
            for (let name in attendanceCount) {
                attendanceCount[name] += attendanceHistory - totalRaids;
            }
        }

        function excused(total: number) {
            return Math.min(attendanceHistory, total + excusedAbsences);
        }

        // Convert object into array of objects, sort by attendance, and return (holy shit we're done).
        const ret: PlayerAttendance[] = Object.entries(attendanceCount).map(([name, totalRaids]) => ({
            name,
            totalRaids: excused(totalRaids),
            raidPct: excused(totalRaids) / attendanceHistory,
            dates: [] as string[]
        }));
        ret.sort((a, b) => b.totalRaids - a.totalRaids);
        for (let i = 0; i < ret.length; i++) {
            ret[i].dates = attendanceDateMap[ret[i].name]
        }
        return ret;
    });
}
